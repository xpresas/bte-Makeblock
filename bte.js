
console.log("Started bte.js")
window.onload = async function () {
    console.log("window.onload passedd")
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function playMusic(mbot) {
        mBot.processBuzzer("E3half");
        await sleep(1000);
        mbot.processBuzzer("E3quarter");
        await sleep(1000);
        mbot.processBuzzer("G3quarter");
    }
    document.getElementById("connectBtn").addEventListener('click', _ => {
        // Request the device
        mBot.request()
            .then(_ => {
                // Connect to the mbot
                return mBot.connect();
            })
            .then(_ => {
                // Connection is done, we show the controls
                let connectedCard = document.getElementById("connectedAlert");
                connectedCard.className = "alert alert-success";
                document.getElementById("connectBtn").style.display = "none";

                // Control the robot by button
                let upBtn = document.getElementById("upBtn");
                let downBtn = document.getElementById('downBtn');
                let leftBtn = document.getElementById('leftBtn');
                let rightBtn = document.getElementById('rightBtn');
                let music1Btn = document.getElementById('music1Btn');
                let music2Btn = document.getElementById('music2Btn');
                upBtn.addEventListener('touchstart', _ => { mBot.processMotor(-250, 250) });
                downBtn.addEventListener('touchstart', _ => { mBot.processMotor(250, -250) });
                leftBtn.addEventListener('touchstart', _ => { mBot.processMotor(250, 250) });
                rightBtn.addEventListener('touchstart', _ => { mBot.processMotor(-250, -250) });

                upBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                downBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                leftBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                rightBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });

                music1Btn.addEventListener('click', _ => {
                    playMusic(mbot);
                    // sleep(1000),
                    // mBot.processBuzzer("E3quarter"),
                    // sleep(1000),
                    // mBot.processBuzzer("G3quarter"),
                    // sleep(1000),
                    // mBot.processBuzzer("E3quarter"),
                    // sleep(1000),
                    // mBot.processBuzzer("D3quarter"),
                    // sleep(1000),
                    // mBot.processBuzzer("C3whole"),
                    // sleep(1000),
                    // mBot.processBuzzer("B2whole")
                });
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


