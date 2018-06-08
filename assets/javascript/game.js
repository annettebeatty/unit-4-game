$(document).ready(function() {

    var playerData =
    {
        name: ["Han Solo", "Lando", "Maul", "Vos"],
        idtag: ["solo-pic", "lando-pic", "maul-pic", "vos-pic"],
        images: ["assets/images/solo.png", "assets/images/lando.png", "assets/images/maul.png", "assets/images/vos.png"],
        startHealth: [120, 100, 150, 180],
        startAttack: [8, 5, 20, 25],
        health: [120, 100, 150, 180],
        attack: [8, 5, 20, 25],
        counterAttack: [0, 0, 0, 0]
    }

    var personID = "4";
    var pickMe = true;
    var gameOver = false;
    var me = 0;
    var enemy = 0;
    var pickEnemy = true;
    var battles = 1;
    var gameInProgress = false;

    if (pickMe)
    {
        document.getElementById("pick").innerHTML = "<h2>Pick your character</h2>";
    }

    $(".person").on("click", function() 
    {
        console.log(this.value);
        personID = this.value;

        // If in the middle of a fight, don't let them pick a guy
        if (gameInProgress)
            return;

        if (pickMe)
            me = personID;
        else 
        {
            enemy = personID;
            pickEnemy = false;

            // Game is going, this will stop them from choosing another enemy if we're in the middle
            // of a battle
            gameInProgress = true;
        }

        setPlayer(playerData, personID, pickMe);
    })

    $("#fight").on("click", function()
    {
        var showHtml = "";

        if(gameOver)
            return;

        if (pickEnemy)
        {
            document.getElementById("game-msg").innerHTML = "<h4>You must pick an enemy to fight.</h4>";
            return;
        }

        console.log("Me: ", me);
        console.log("Enemy: ", enemy);
        console.log("Fighting: ", playerData.name[enemy]);



        console.log("My health: ", playerData.health[me]);
        console.log("Enemy health: ", playerData.health[enemy]);
        console.log("My attack: ", playerData.attack[me]);
        console.log("Enemy attack: ", playerData.attack[enemy]);

        $("#myStats").removeClass("hideit");
        $("#enemyStats").removeClass("hideit");

        // I attack first
        playerData.health[enemy] = playerData.health[enemy] - playerData.attack[me];
        enemyStats.innerHTML = `<div> You attacked ${playerData.name[enemy]} for ${playerData.attack[me]} damage.</div>
        `
        document.getElementById("enemyChar").innerHTML = displayIt(playerData, enemy);

        // My attacks get better with each one
        playerData.attack[me] += playerData.startAttack[me];

        if (playerData.health[enemy] < 0)
        {
            // He loses, I win
            // Can live to fight another day
            console.log("I win - my health: ", playerData.health[me]);
            console.log("Enemy health: ", playerData.health[enemy]);

            $("#game-msg").removeClass("hideit");
            showHtml = "<h4>You have defeated " + playerData.name[enemy] + ", you can choose to fight another enemy.";
            document.getElementById("game-msg").innerHTML = showHtml;
            pickEnemy = true;
            gameInProgress = false;

            // Make this guy disappear and messages disappear
            $("#enemyChar").addClass("hideit");
            $("#myStats").addClass("hideit");
            $("#enemyStats").addClass("hideit");

            if (battles < 3)
            {
                battles++;
                console.log("Battles: ", battles);
            }
            else
            {
                console.log("Won it all Battles: ", battles);
                document.getElementById("game-msg").innerHTML = "<h2>WINNER!!!  Game Over!!</h2>";
                gameOver = true;
                $("#fight").addClass("hideit");

                // Reset to play again
                $("#reset").removeClass("hideit");
                return;
            }
            return;
        }

        // Now he retaliates
        playerData.health[me] = playerData.health[me] - playerData.attack[enemy];
   
        myStats.innerHTML = `<div> ${playerData.name[enemy]} attacked you for ${playerData.attack[enemy]} damage.</div>
        `
        document.getElementById("playerChar").innerHTML = displayIt(playerData, me);

        // See if someone wins
        if (playerData.health[me] < 0)
        {
            // I lose "You have been defeated... GAME OVER!!"
            console.log("I lose - my health: ", playerData.health[me]);
            console.log("Enemy health: ", playerData.health[enemy]);
            $("#game-msg").removeClass("hideit");
            document.getElementById("game-msg").innerHTML = "<h4>You have been defeated... GAME OVER</h4>";
            gameOver = true;

            // Reset to play again
            $("#reset").removeClass("hideit");
            return;
        }

    })

    $("#reset").on("click", function()
    {
        document.getElementById("pick").innerHTML = "<h2>Pick your character</h2>";
        resetGame(playerData);

        $("#reset").addClass("hideit");
        gameOver = false;
    })

    function setPlayer(playerData, personID)
    {
        var playerElem = parseInt(personID);
        var meString = "";

        console.log("Hiding", playerData.name[playerElem]);

        document.getElementById(playerData.idtag[playerElem]).setAttribute("class", "hideit");

        meString = displayIt(playerData, playerElem);

        if (pickMe)
        {
            $("#playerChar").addClass("player-container");
            $("#playerChar").removeClass("hideit");
            document.getElementById("playerChar").innerHTML = meString;
            document.getElementById("pick").innerHTML = "<h2>Pick your enemy</h2>";
            pickMe = false;
        } 
        else   // Picking enemy
        {
            $("#enemyChar").addClass("player-container");
            $("#enemyChar").removeClass("hideit");
            document.getElementById("enemyChar").innerHTML = meString;
            document.getElementById("pick").innerHTML = "<h2>Let's Battle!!</h2>";
            $("#fight").removeClass("hideit");
        }
    }

    function displayIt(playerData, playerElem)
    {
        var htmlString;

        htmlString = "<p>" + playerData.name[playerElem] + "</p>";
        htmlString = htmlString + '<img class="center" src="' + playerData.images[playerElem] + '">';
        console.log("Mestring", htmlString);
        htmlString = htmlString + "<p>Health: " + playerData.health[playerElem] + "</p>";

        return htmlString;
    }

    function resetGame(playerData, playerElem)
    {
        // Reset health, unhide all the characters
        for(var i=0; i < playerData.attack.length; i++)
        {
            playerData.attack[i] = playerData.startAttack[i];
            playerData.health[i] = playerData.startHealth[i];
        }

        battles = 1;
        gameInProgress = false;

        // Show all the characters
        $("#solo-pic").removeClass("hideit");
        $("#lando-pic").removeClass("hideit");
        $("#maul-pic").removeClass("hideit");
        $("#vos-pic").removeClass("hideit");
        $("#solo-pic").addClass("player-container");
        $("#lando-pic").addClass("player-container");
        $("#maul-pic").addClass("player-container");
        $("#vos-pic").addClass("player-container");

        // Hide everything else
        $("#playerChar").addClass("hideit");
        $("#enemyChar").addClass("hideit");
        $("#myStats").addClass("hideit");
        $("#enemyStats").addClass("hideit");
        $("#fight").addClass("hideit");
        $("#game-msg").addClass("hideit");

        // Got to pick a character to be
        pickMe = true;
    }
})