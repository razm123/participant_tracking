let siteNum;
if (location.href === `https://${window.location.host}/site1`) {
    siteNum = 1;
} else if (location.href === `https://${window.location.host}/site2`) {
    siteNum = 2;
} else if (location.href === `https://${window.location.host}/site3`) {
    siteNum = 3;
}
const totalApplicants = 167;

function calcAvailable(race, percentage) {
    return Math.floor(totalApplicants * percentage - race);
}

// test

function updateTable(data) {
    const testArray = [];

    const totalRaceLength = data.filter(({ race, site }) => race && site === siteNum).length;
    const whiteLength = data.filter(({ race, site }) => race === "white" && site === siteNum).length;
    const blackLength = data.filter(({ race, site }) => race === "black" && site === siteNum).length;
    const otherLength = data.filter(({ race, site }) => race === "other" && site === siteNum).length;
    const totalGroupLength = data.filter(({ group, site }) => group && site === siteNum).length;
    const group11Length = data.filter(({ group, site }) => group === "group1" && site === siteNum).length;
    const group2Length = data.filter(({ group, site }) => group === "group2" && site === siteNum).length;
    const group3Length = data.filter(({ group, site }) => group === "group3" && site === siteNum).length;
    // let p = document.getElementById("row").textContent;
    let whiteAvailable = calcAvailable(whiteLength, 0.6);
    let blackAvailable = calcAvailable(blackLength, 0.158);
    let otheravailable = calcAvailable(otherLength, 0.25);
    let group1Available = calcAvailable(group11Length, 0.4);
    let group2Available = calcAvailable(group2Length, 0.4);
    let group3Available = calcAvailable(group3Length, 0.21);
    // let blackAvailable =
    // document.getElementById("row").textContent = propLength / totalLength;
    if (whiteLength / totalApplicants < 0.6 && whiteAvailable != 0) {
        document.getElementById("white").textContent = whiteAvailable;
    } else {
        document.getElementById("whiteRow").style.display = `none`;
    }

    if (blackLength / totalApplicants < 0.15 && blackAvailable != 0) {
        document.getElementById("black").textContent = blackAvailable;
    } else {
        document.getElementById("blackRow").style.display = "none";
    }
    // prettier-ignore
    if (otherLength / totalApplicants < 0.25 && otheravailable != 0) {
        document.getElementById("other").textContent = otheravailable;
    } else {
        document.getElementById("otherRow").style.display = "none";
    }

    if (group11Length / totalApplicants < 0.4 && group1Available != 0) {
        document.getElementById("group1").textContent = group1Available;
    } else {
        document.getElementById("group1Row").style.display = "none";
    }

    if (group2Length / totalApplicants < 0.4 && group2Available != 0) {
        document.getElementById("group2").textContent = group2Available;
    } else {
        document.getElementById("group2Row").style.display = "none";
    }

    if (group3Length / totalApplicants < 0.2 && group3Available != 0) {
        document.getElementById("group3").textContent = group3Available;
    } else {
        document.getElementById("group3Row").style.display = "none";
    }
}

const socket = io.connect("wss://study.com:8443");

let allData = [];
socket.on("message", (data) => {
    allData = data;
    updateTable(data);
});
socket.on("data", (data) => {
    allData.push(data);
    updateTable(allData);
});
