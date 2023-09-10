// JavaScript code to handle the form submission

let totalApplicants = 167;
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

function changeFormColor(data) {
    document.getElementById("selectSite").addEventListener("change", (e) => {
        let siteNum = parseInt(e.target.value);
        const totalRaceLength = data.filter(({ race, site }) => race && site === siteNum).length;
        const whiteLength = data.filter(({ race, site }) => race === "white" && site === siteNum).length;
        const blackLength = data.filter(({ race, site }) => race === "african-american" && site === siteNum).length;
        const otherLength = data.filter(({ race, site }) => race === "other" && site === siteNum).length;
        const totalGroupLength = data.filter(({ group, site }) => group && site === siteNum).length;
        const group11Length = data.filter(({ group, site }) => group === "group1" && site === siteNum).length;
        const group2Length = data.filter(({ group, site }) => group === "group2" && site === siteNum).length;
        const group3Length = data.filter(({ group, site }) => group === "group3" && site === siteNum).length;
        // let p = document.getElementById("row").textContent;
        let whiteAvailable = calcAvailable(whiteLength, 0.6);
        let blackAvailable = calcAvailable(blackLength, 0.15);
        let otherAvailable = calcAvailable(otherLength, 0.25);
        let group1Available = calcAvailable(group11Length, 0.4);
        let group2Available = calcAvailable(group2Length, 0.4);
        let group3Available = calcAvailable(group3Length, 0.2);
        if (whiteAvailable === 0) {
            document.getElementById("whiteSelect").style.color = `red`;
        } else {
            document.getElementById("whiteSelect").style.color = "white";
        }

        if (blackAvailable <= 0) {
            document.getElementById("blackSelect").style.color = `red`;
        } else {
            document.getElementById("blackSelect").style.color = `white`;
        }

        if (otherAvailable <= 0) {
            document.getElementById("otherSelect").style.color = `red`;
        } else {
            document.getElementById("otherSelect").style.color = `white`;
        }

        if (group1Available <= 0) {
            document.getElementById("group1Select").style.display = `none`;
        } else {
            document.getElementById("group1Select").style.display = `initial`;
        }

        if (group2Available <= 0) {
            document.getElementById("group2Select").style.display = `none`;
        } else {
            document.getElementById("group2Select").style.display = `initial`;
        }

        if (group3Available <= 0) {
            document.getElementById("group3Select").style.display = `none`;
        } else {
            document.getElementById("group3Select").style.display = `initial`;
        }
    });
}

totalApplicants = 167;

function calcAvailable(race, percentage) {
    return Math.floor(totalApplicants * percentage - race);
}
const socket = io("wss://study.com:8443");

socket.on("message", (data) => {
    allData = data;
    changeFormColor(data);
});
