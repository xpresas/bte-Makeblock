
console.log("Started bte.js")
window.onload = function () {
    console.log("window.onload passedd")
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
                let musicBtn = document.getElementById('musicBtn');
                upBtn.addEventListener('touchstart', _ => { mBot.processMotor(-250, 250) });
                downBtn.addEventListener('touchstart', _ => { mBot.processMotor(250, -250) });
                leftBtn.addEventListener('touchstart', _ => { mBot.processMotor(250, 250) });
                rightBtn.addEventListener('touchstart', _ => { mBot.processMotor(-250, -250) });

                upBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                downBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                leftBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });
                rightBtn.addEventListener('touchend', _ => { mBot.processMotor(0, 0) });

                musicBtn.addEventListener('click', _ => { mBot.processBuzzer() });
            })
    })

}


