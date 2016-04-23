// First, we find out what team we're on
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
var team_num = /\d/.exec(filename);
var running = 0;
var hints = 0;
var clicked = 0;
console.log("I'm on team " + team_num);
color = ["","purple","pink","teal","blue"];
$("#thefooter").css("background-color",color[parseInt(team_num)]);
$("#header").css("background-color",color[parseInt(team_num)]);
$("#hintMeBabyOneMoreTime").hide();


// If we're an admin page, add info to the footer
if (filename.includes("admin")) {
    $("#hintMeBabyOneMoreTime").show();
    var footerElt = document.getElementById("thefooter");
    footerElt.innerHTML += '<a href="#" id="team1btn" class="button">Team 1</a><a href="#" id="team2btn" class="button">Team 2</a><a href="#" id="team3btn" class="button">Team 3</a><a href="#" id="team4btn" class="button">Team 4</a><a href="#" id="resetbtn" class="button">RESET</a>'

    var myTeamSelector = "#team" + team_num + "btn";
    $(function() {
        $(myTeamSelector).text("Advance");
        $(myTeamSelector).click(function()
        {
            clicked = 1;
            running = 1;
            hints = 0;
            $.get("advance_state/"+team_num);
            return false; // don't reload
        });
        $("#hintMeBabyOneMoreTime").click(function()
        {
            if(hints++<=1 && running){
                clicked = 1;
                $.get("hintMeBabyOneMoreTime/"+team_num);
            }
            return false; // don't reload
        });

        $("#resetbtn").click(function()
        {
            running = 0;
            $("#hints").text("0");
            $.get("reset");
            return false;
        });
    });
}

function handleMIPSEvent(evt) {
    // load the correct part of our page
    console.log("New event: " + evt);
    newState = evt.split(',');
    myState = newState[(team_num*2)-1];
    hintState = newState[(team_num*2)];
    console.log("new state is " + newState + ", my state is: " + myState);
    setMyActiveState(myState,hintState);
    if (filename.includes("admin")) {
        team3State = newState[3];
        btn = document.getElementById("team3btn");
        if (team3State == 7) {
            btn.style.background="#32CD32";
        } else {
            btn.style.background=null;
        }
    }
}

// Reveal content related to the current state
function setMyActiveState(n,h) {
    clicked = 0;
    var x = parseInt(n);
    if(x==0||x%3==1){
        // makeAllHidden();
        $("#mips-content").html("");
    }
    // var newStateContainer = 
    $("#hints").html(h);
    console.log("hints used: "+h);
    $("#mips-content").prepend(mips[x]);
    // if (typeof newStateContainer !== 'undefined' && newStateContainer !== null) {
    //     newStateContainer.style.display = "initial";
    // }
}

// Make all the content hidden
/*function makeAllHidden() {
    var contentHandles = document.getElementsByClassName("ui-content");
    for (i = 0; i < contentHandles.length; i++) {
        contentHandles[i].style.display = "none";
    }
}*/

// set the initial state
$.get("current_state", function(data) {
    handleMIPSEvent(data);
});

// Setup the communication channel
var eventOutputContainer = document.getElementById("main");
console.log(eventOutputContainer);
var evtSrc = new EventSource("/subscribe");

evtSrc.onmessage = function(e) {
    handleMIPSEvent(e.data);
};
