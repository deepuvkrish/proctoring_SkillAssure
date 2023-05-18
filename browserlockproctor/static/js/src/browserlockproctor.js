/* Javascript for BrowserlockproctorXBlock. */
function BrowserlockproctorXBlock(runtime, element) {
    let allow=false;
    let understood=false;
    let count=0;

    function lockBrowser(){
        isLocked=true;
        var currentUrl = window.location.href;
        // window.open(currentUrl,'_blank');
        var start = document.getElementById('proctorstrt');
        start.disabled = true;
        start.style.visibility="hidden"; 
        document.getElementById("proctorstp").classList.replace("proctorstpBeforebtn","proctorstpbtn");
        var enable = document.getElementById('enabledisable');
        enable.innerHTML="Enabled";
        enable.classList.toggle('successMsg');
        document.getElementById('proctorInstruction').innerHTML='This exam is being proctored. Please ensure that your browser is in locked mode.'
        // var lockScreen = document.createElement('div');
        // lockScreen.style.position='fixed';
        // lockScreen.style.top='0';
        // lockScreen.style.left='0'
        // lockScreen.style.width='100%';
        // lockScreen.style.height='100%';
        // lockScreen.style.backgroundColor='white';
        // lockScreen.style.zIndex='9999';
        // document.body.appendChild(lockScreen);
       lockThisbrowser();
       disableNewTabClick();
       let contentExam=document.getElementById('examCnt');
       contentExam.classList.replace("examContent","examContentVisible");
    }

    function lockThisbrowser(){
        document.addEventListener('copy', function (event){
            event.preventDefault();
        });
        document.addEventListener('cut', function(event){
            event.preventDefault();
        });
        document.addEventListener('paste', function(event){
            event.preventDefault();
        });
        document.addEventListener('dragstart', function(event){
            event.preventDefault();
        });
        document.addEventListener('pageshow', function(event){
            event.preventDefault();
        });
        document.addEventListener('select', function(event){
            event.preventDefault();
        });
        document.addEventListener('contextmenu', function(event){
            event.preventDefault();
        });
        document.addEventListener('dblclick', function(event){
            event.preventDefault();
        });
        document.addEventListener('drag', function(event){
            event.preventDefault();
        });
        document.addEventListener('resize', function(event){
            event.preventDefault();
        });
        // window.addEventListener("focus", () => {
            
        // });
        window.addEventListener("blur", () => {
            count=count+1;
            if(count>1 && count<=4){
                document.getElementById('warningTxt').innerHTML=(count-1)+"/3 warning !";
            }
            else if(count>4)
            {
                document.getElementById('examCnt').classList.replace("examContentVisible","examContent");
                var errormsg=document.getElementById('proctorInstruction');
                errormsg.style.color="red";
                errormsg.innerHTML="Due to violation in terms you are hereby terminated from this assessment";
                var terminate=document.getElementById('proctorstp');
                terminate.classList.replace('proctorstpbtn','terminate');
                terminate.disabled = true; 
                leaveAssessment()
            }
        });
        window.addEventListener('beforeunload',confirmLeave);
    }

    function leaveAssessment(){
        document.getElementById('videoCam').classList.replace("cameraAuth","cameraBefore");
        isLocked=false;
        window.onbeforeunload=null;
        setTimeout(() => {
            window.location.reload();
          }, 3000);
          
    }

    function disableNewTabClick() {  
        var listCtrl = document.getElementsByTagName('a');  
        for (var i = 0; i < listCtrl.length; i++) {  
            listCtrl[i].onmousedown = function(event) {  
                if (!event) event = window.event;  
                if (event.ctrlKey) {  
                    alert("Functionality for Opening links in a new tab/window is disabled !");  
                    return false;  
                }  
                if (event.shiftKey) {  
                    alert("Functionality for Opening links in a new tab/window is disabled !");  
                    return false;  
                }  
                if (event.shiftKey && event.ctrlKey) {  
                    alert("Functionality for Opening links in a new tab/window is disabled !");  
                    return false;  
                }  
            }  
        }  
    }  

    function unlockBrowser(){
        isLocked=false;
        var disable=document.getElementById('enabledisable');
        disable.innerHTML="Exam Over";
        disable.classList.toggle('endMsg');
        document.getElementById('proctorInstruction').innerHTML='Thankyou for taking the examination'
        document.getElementById('proctorstp').disabled = true; 
        leaveAssessment()
    }

    function confirmLeave(event){
        if(isLocked){
            event.preventDefault();
            event.returnValue = 'Cannot leave this window untill exam is over';
        }
    }

    function locktab(){
        return "Cannot leave this window untill exam is over";
    }

    function handleUnlock(response){
        if(response.success){
            alert("Browser has been unlocked successfully.");
            location.reload();
        }
        else{
            alert(response.message);
        }
    }
    
    $(function ($) {
        $('#understoodID').click(function(eventObject) {
            var understdIcon=document.getElementById('understoodIcon');
            understdIcon.classList.replace('fa-square-checkhide','fa-square-check');
            understdIcon.classList.add('fa-solid');
            understood=true;
            eventObject.preventDefault(); 
            document.getElementById('proctorstrt').disabled=false;

           })

        $('#proctorstrt').click(function(eventObject) {
        if(confirm('Are you sure to start the exam?')){
            eventObject.preventDefault();
            document.getElementById('warningId').classList.replace("warningMsg","warningMsgHide");
            if(allow==true && understood==true){
                lockBrowser();
            }

        }
        })
        
       $('#proctorstp').click(function(eventObject) {
        if (confirm('Are you sure,you want to submit now?')){
            eventObject.preventDefault();                       
            unlockBrowser();
        }
       })

       $('#camAccess').click(function openCam(){
            allow=true;
            let All_mediaDevices=navigator.mediaDevices
            if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
            console.log("getUserMedia() not supported.");
            return;
            }
            All_mediaDevices.getUserMedia({
            audio: true,
            video: true
            })
            .then(function(vidStream) {
            var video = document.getElementById('videoCam');
            if ("srcObject" in video) {
                video.srcObject = vidStream;
            } else {
                video.src = window.URL.createObjectURL(vidStream);
            }
            video.onloadedmetadata = function(e) {
                video.play();
            };
            })
            .catch(function(e) {
            console.log(e.name + ": " + e.message);
            });
            document.getElementById('videoCam').classList.replace("cameraBefore","cameraAuth");
            document.getElementById('instructionId').classList.replace("IntructionMenu","IntructionMenuHide");
            document.getElementById('warningId').classList.replace("warningMsgHide","warningMsg");

        })
        
    });
}

// 
// document.getElementById('showScreen').classList.replace("showProcScreenDisable","showProcScreen");
// 