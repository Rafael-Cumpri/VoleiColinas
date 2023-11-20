const fixedPlayers = {
  'Raillan': 5,
  'Cumpri': 5,
  'Candido': 5,
  'Jotape': 5,
  'Luciano': 5,
  'Andrew': 5,
  'Gabriel': 5,
  'Hyago': 5,
  'Nathan': 5,
  'Fe': 5,
  'Ellen': 4,
  'Lara': 4,
  'Lissie A.': 4,
  'Oliveira': 4,
  'Pc': 3,
  'Peixoto': 3,
  'Raianne': 3,
  'Cidinha': 3,
  'Ryan': 3,
  'Pedro': 3,
  'Maria': 3,
}

let players = [];
let teams = [];

function addPlayer() {
  const playerName = document.getElementById('playerName').value;
  const playerLevel = parseInt(document.getElementById('playerLevel').value);

  if (playerName && !isNaN(playerLevel) && playerLevel >= 1 && playerLevel <= 5) {
    const player = { id: generateId(), name: playerName, level: playerLevel };
    players.push(player);
    updatePlayerList();
    clearInputFields();
  }
}

function updatePlayerList() {
  const playerList = document.getElementById('playerList');
  playerList.innerHTML = '';
  players.forEach(player => {
    const li = createPlayerListItem(player);
    playerList.appendChild(li);
  });
}

function clearInputFields() {
  document.getElementById('playerName').value = '';
  document.getElementById('playerLevel').value = '';
}

function doDraw() {
  const selectedPlayers = getSelectedPlayers();
  const allPlayers = [...players, ...selectedPlayers];

  if (allPlayers.length >= 12) {
    teams = createTeams(allPlayers);
    displayTeams(teams);
  } else {
    alert("É necessário ter pelo menos 12 jogadores para realizar o sorteio.");
  }
}

function createTeams(players) {
  const shuffledPlayers = shuffleArray(players);
  const numberOfTeams = Math.ceil(shuffledPlayers.length / 6);
  const teams = [];

  for (let i = 0; i < numberOfTeams; i++) {
    teams.push(shuffledPlayers.slice(i * 6, (i + 1) * 6));
  }

  return teams;
}

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function displayTeams(teams) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = '';

  teams.forEach((team, index) => {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'team';
    teamDiv.innerHTML = `<h3>Time ${index + 1}</h3>`;

    teamDiv.addEventListener('dragover', handleDragOver);
    teamDiv.addEventListener('drop', (e) => handleDrop(e, index));

    team.forEach((player, playerIndex) => {
      const playerInfo = document.createElement('p');
      playerInfo.classList.add('touch-drag');
      playerInfo.textContent = `${player.name} - Nível: ${player.level}`;
      playerInfo.draggable = true;
      playerInfo.dataset.teamIndex = index;
      playerInfo.dataset.playerIndex = playerIndex;
      playerInfo.addEventListener('dragstart', handleDragStart);
      teamDiv.appendChild(playerInfo);
    });

    resultContainer.appendChild(teamDiv);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', JSON.stringify({
    teamIndex: e.target.dataset.teamIndex,
    playerIndex: e.target.dataset.playerIndex
  }));
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e, targetTeamIndex) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const { teamIndex, playerIndex } = data;

  if (teamIndex !== undefined && playerIndex !== undefined) {
    // Move o jogador entre os times
    const player = teams[teamIndex][playerIndex];
    teams[teamIndex].splice(playerIndex, 1);
    teams[targetTeamIndex].push(player);

    // Atualiza a exibição dos times
    displayTeams(teams);
  }
}

function createPlayerListItem(player) {
  const li = document.createElement('li');
  li.draggable = true;
  li.dataset.playerId = player.id;
  li.innerHTML = `${player.name}`;
  li.addEventListener('dragstart', handleDragStart);
  return li;
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function getSelectedPlayers() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedPlayers = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const playerName = checkbox.value;
      const playerLevel = getPlayerLevel(playerName);
      selectedPlayers.push({ id: generateId(), name: playerName, level: playerLevel });
    }
  });

  return selectedPlayers;
}

function fixedPlayersList() {
  let html = '';

  const fixedPlayersLevels = fixedPlayers

  for (let playerName in fixedPlayersLevels) {
    html += `<li><label><input type="checkbox" value="${playerName}" /> ${playerName}</label></li>`;
  }

  document.getElementById('fixedPlayersList').innerHTML = html;
}

function getPlayerLevel(playerName) {
  // Defina os níveis dos jogadores fixos conforme necessário
  const fixedPlayersLevels = fixedPlayers

  return fixedPlayersLevels[playerName] || 1; // Se o jogador não estiver na lista, atribui nível 1
}

function switchToTeamDraw() {
    // Oculta o placar de vôlei
    document.getElementById('volleyballScoreboard').style.display = 'none';

    // Exibe o conteúdo de sortear times
    document.getElementById('mainContent').style.display = 'block';
  }

  let team1Score = 0;
  let team2Score = 0;
  
  function addPoint(team) {
    if (team === 1) {
      team1Score++;
      updateScoreboard();
    } else if (team === 2) {
      team2Score++;
      updateScoreboard();
    }
  }
  
  function removePoint(team) {
    if (team === 1 && team1Score > 0) {
      team1Score--;
      updateScoreboard();
    } else if (team === 2 && team2Score > 0) {
      team2Score--;
      updateScoreboard();
    }
  }
  
  function resetScore() {
    team1Score = 0;
    team2Score = 0;
    updateScoreboard();
  }
  
  function updateScoreboard() {
    document.getElementById('team1Score').innerHTML = `<p>Pontos: ${team1Score}</p>`;
    document.getElementById('team2Score').innerHTML = `<p>Pontos: ${team2Score}</p>`;
  }

  function showVolleyballScoreboard() {
    // Oculta o conteúdo de sortear times
    document.getElementById('mainContent').style.display = 'none';

    // Exibe o placar de vôlei
    document.getElementById('volleyballScoreboard').style.display = 'block';
  }