
console.log("Started bte.js")
function pianoToggle() {
    var pianoDiv = document.getElementById("pianoDiv");
    if (pianoDiv.style.display === "none") {
        pianoDiv.style.display = "grid";
    } else {
        pianoDiv.style.display = "none";
    }
}
document.getElementById("pianoBtn").addEventListener('click', _ => pianoToggle());
window.onload = async function () {
    document.getElementById("connectBtn").addEventListener('click', _ => {
        // Request the device
        mBot.request()
            .then(_ => {
                // Connect to the mbot
                return mBot.connect();
            })
            .then(_ => {


                //speed slider
                var rangeslider = document.getElementById("sliderRange");
                var output = document.getElementById("speedInfo");
                output.innerHTML = rangeslider.value;

                rangeslider.oninput = function () {
                    output.innerHTML = this.value;
                }
                //color sliders
                var r = document.getElementById('r');
                var g = document.getElementById('g');
                var b = document.getElementById('b');

                // Connection is done, we change the card
                let connectedCard = document.getElementById("connectedAlert");
                connectedCard.className = "alert alert-success";
                connectedCard.innerHTML = "Connected!"
                document.getElementById("connectBtn").style.display = "none";

                // Control the robot by button
                let upBtn = document.getElementById("upBtn");
                let downBtn = document.getElementById('downBtn');
                let leftBtn = document.getElementById('leftBtn');
                let rightBtn = document.getElementById('rightBtn');
                //notes
                let music1Btn = document.getElementById('music1Btn');
                let music2Btn = document.getElementById('music2Btn');
                //color switcher
                let ledLeft = document.getElementById('LEDLeft');
                let ledRight = document.getElementById('LEDRight');
                let ledBoth = document.getElementById('LEDBoth');
                //MusicButtons
                let noteA = document.getElementById("noteA");
                let noteB = document.getElementById('noteB');
                let noteC = document.getElementById('noteC');
                let noteD = document.getElementById('noteD');
                let noteE = document.getElementById("noteE");
                let noteF = document.getElementById('noteF');
                let noteG = document.getElementById('noteG');

                //Move events that send movements to the robot
                upBtn.addEventListener('touchstart', _ => { mBot.processMotor(-rangeslider.value, rangeslider.value) });
                downBtn.addEventListener('touchstart', _ => { mBot.processMotor(rangeslider.value, -rangeslider.value) });
                leftBtn.addEventListener('touchstart', _ => { mBot.processMotor(rangeslider.value, rangeslider.value) });
                rightBtn.addEventListener('touchstart', _ => { mBot.processMotor(-rangeslider.value, -rangeslider.value) });

                upBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                downBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                leftBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                rightBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                //Color events that change LED colors on the robot
                ledLeft.addEventListener('touchstart', _ => {
                    var hex = document.getElementById('hex').innerText;
                    mBot.processColor(2, r.value, g.value, b.value);
                    ledLeft.style.backgroundColor = hex;
                });
                ledRight.addEventListener('touchstart', _ => {
                    var hex = document.getElementById('hex').innerText;
                    mBot.processColor(1, r.value, g.value, b.value);
                    ledRight.style.backgroundColor = hex;
                });
                ledBoth.addEventListener('touchstart', _ => {
                    var hex = document.getElementById('hex').innerText;
                    mBot.processColor(0, r.value, g.value, b.value);
                    ledBoth.style.backgroundColor = hex;
                });
                //note requests
                noteA.addEventListener('click', _ => {
                    mBot.processBuzzer("A2quarter");
                });
                noteB.addEventListener('click', _ => {
                    mBot.processBuzzer("B2quarter");
                });
                noteC.addEventListener('click', _ => {
                    mBot.processBuzzer("C3quarter");
                });
                noteD.addEventListener('click', _ => {
                    mBot.processBuzzer("D3quarter");
                });
                noteE.addEventListener('click', _ => {
                    mBot.processBuzzer("E3quarter");
                });
                noteF.addEventListener('click', _ => {
                    mBot.processBuzzer("F3quarter");
                });
                noteG.addEventListener('click', _ => {
                    mBot.processBuzzer("G3quarter");
                });

            })
    })

}


