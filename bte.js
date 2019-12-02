
console.log("Started bte.js")
window.onload = async function () {
    console.log("window.onload passedd")
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    document.getElementById("connectBtn").addEventListener('click', _ => {
        // Request the device
        mBot.request()
            .then(_ => {
                // Connect to the mbot
                return mBot.connect();
            })
            .then(_ => {
                var rangeslider = document.getElementById("sliderRange");
                var output = document.getElementById("speedInfo");
                output.innerHTML = rangeslider.value;

                rangeslider.oninput = function () {
                    output.innerHTML = this.value;
                }

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
                    r = document.getElementById('sliderRange').innerText;
                    g = document.getElementById('sliderRange').innerText;
                    b = document.getElementById('sliderRange').innerText;
                    mBot.processColor(2, r, g, b);
                    ledLeft.style.backgroundColor = document.getElementById("hex").innerText;
                });
                ledRight.addEventListener('touchstart', _ => {
                    r = document.getElementById('r_out').innerText;
                    g = document.getElementById('g_out').innerText;
                    b = document.getElementById('b_out').innerText;
                    mBot.processColor(1, r, g, b);
                    ledRight.style.backgroundColor = document.getElementById("hex").innerText;
                });
                ledBoth.addEventListener('touchstart', _ => {
                    r = document.getElementById('r_out').innerText;
                    g = document.getElementById('g_out').innerText;
                    b = document.getElementById('b_out').innerText;
                    mBot.processColor(0, r, g, b);
                    ledBoth.style.backgroundColor = document.getElementById("hex").innerText;
                    ledRight.style.backgroundColor = document.getElementById("hex").innerText;
                    ledLeft.style.backgroundColor = document.getElementById("hex").innerText;
                });

                // music1Btn.addEventListener('click', _ => {

                //     // sleep(1000),
                //     // mBot.processBuzzer("E3quarter"),
                //     // sleep(1000),
                //     // mBot.processBuzzer("G3quarter"),
                //     // sleep(1000),
                //     // mBot.processBuzzer("E3quarter"),
                //     // sleep(1000),
                //     // mBot.processBuzzer("D3quarter"),
                //     // sleep(1000),
                //     // mBot.processBuzzer("C3whole"),
                //     // sleep(1000),
                //     // mBot.processBuzzer("B2whole")
                // });
                // music2Btn.addEventListener('click', _ => {
                //     // mBot.processBuzzer("E3half")
                //     // mBot.processBuzzer("E3quarter")
                //     // mBot.processBuzzer("G3quarter")
                //     // mBot.processBuzzer("E3quarter")
                //     // mBot.processBuzzer("D3quarter")
                //     // mBot.processBuzzer("C3whole")
                //     mBot.processBuzzer("C3whole")
                // });
            })
    })

}


