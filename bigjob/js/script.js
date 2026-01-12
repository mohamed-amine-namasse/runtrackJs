// --- Fonction Utilitaire pour Afficher/Effacer les Erreurs ---
function displayError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + "-error");
  errorElement.textContent = message;
}

// --- 1. Validation Générique (Nom, Prénom) ---
function validateField(fieldName, value) {
  displayError(fieldName, ""); // Efface les erreurs précédentes

  const cleanedValue = value.trim();

  if (cleanedValue.length === 0) {
    displayError(
      fieldName,
      `Le champ ${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } est obligatoire.`
    );
    return false;
  }

  // A. Validation pour Nom/Prénom (Rejette les chiffres et la plupart des symboles)
  if (fieldName === "nom" || fieldName === "prenom") {
    // Nouvelle Regex : Accepte lettres, espaces, apostrophes, traits d'union. Rejette les chiffres.
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;

    if (cleanedValue.length < 2 || cleanedValue.length > 50) {
      displayError(
        fieldName,
        `Le ${fieldName} doit contenir entre 2 et 50 caractères.`
      );
      return false;
    }

    if (!nameRegex.test(cleanedValue)) {
      displayError(
        fieldName,
        `Le ${fieldName} ne doit contenir que des lettres, espaces, traits d'union et apostrophes.`
      );
      return false;
    }
  }

  return true;
}
//2. Validation Email (Client + Asynchrone Serveur) ---
function validateEmail(email) {
  const errorElement = document.getElementById("email-error");
  errorElement.textContent = ""; // Efface les erreurs précédentes
  const requiredDomain = "@laplateforme.io"; // Le domaine requis

  // 1. Validation de format CÔTÉ CLIENT (rapide)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorElement.textContent = "Veuillez entrer une adresse e-mail valide.";
    return;
  }

  if (!email.endsWith(requiredDomain)) {
    errorElement.textContent = `Nom de domaine incorrect, l'adresse e-mail doit se terminer par ${requiredDomain}.`;
    return;
  }
}

// --- Validation Mot de Passe (Feedback en temps réel - oninput) ---
function validatePassword(password) {
  displayError("password", ""); // Efface les erreurs précédentes

  // 1. VÉRIFICATION DU CHAMP VIDE
  if (password.length === 0) {
    displayError("password", "Le mot de passe est obligatoire.");
    return false;
  }

  // 2. VÉRIFICATION DE LA COMPLEXITÉ
  let errors = [];

  // Longueur minimale
  if (password.length < 8) {
    errors.push("8 caractères minimum");
  }
  // Majuscule
  if (!/[A-Z]/.test(password)) {
    errors.push("une majuscule");
  }
  // Chiffre
  if (!/[0-9]/.test(password)) {
    errors.push("un chiffre");
  }
  // Symbole/Caractère spécial
  // Rejette les lettres, chiffres et espaces pour identifier un caractère spécial
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    errors.push("un caractère spécial");
  }

  if (errors.length > 0) {
    // Affiche un message d'erreur clair si des règles ne sont pas respectées
    const required = errors.join(", ");
    displayError("password", `Le mot de passe doit contenir : ${required}.`);
    return false;
  }

  return true;
}
// --- Validation Mot de Passe (Feedback en temps réel - oninput) ---
function validateConfirmPassword(confirmPassword) {
  displayError("confirm_password", ""); // Efface les erreurs précédentes

  // 1. VÉRIFICATION DU CHAMP VIDE
  if (confirmPassword.length === 0) {
    displayError(
      "confirm_password",
      "La confirmation de mot de passe est obligatoire."
    );
    return false;
  }

  // 2. VÉRIFICATION DE LA COMPLEXITÉ
  let errors = [];

  // Longueur minimale
  if (confirmPassword.length < 8) {
    errors.push("8 caractères minimum");
  }
  // Majuscule
  if (!/[A-Z]/.test(confirmPassword)) {
    errors.push("une majuscule");
  }
  // Chiffre
  if (!/[0-9]/.test(confirmPassword)) {
    errors.push("un chiffre");
  }
  // Symbole/Caractère spécial
  // Rejette les lettres, chiffres et espaces pour identifier un caractère spécial
  if (!/[^A-Za-z0-9\s]/.test(confirmPassword)) {
    errors.push("un caractère spécial");
  }

  if (errors.length > 0) {
    // Affiche un message d'erreur clair si des règles ne sont pas respectées
    const required = errors.join(", ");
    displayError(
      "confirm_password",
      `Le mot de passe doit contenir : ${required}.`
    );
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Récupérer le formulaire de connexion (seulement sur la page connexion.html)
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

// Fonction pour gérer la connexion
async function handleLogin(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire par défaut

  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  const errorDisplay = document.getElementById("loginError");

  // Cacher l'erreur précédente
  errorDisplay.classList.add("d-none");

  try {
    // 2. Tenter de charger les utilisateurs depuis le fichier JSON
    const response = await fetch("./users.json");

    // Vérifier si le fichier a été trouvé et lu
    if (!response.ok) {
      throw new Error(`Erreur de chargement des données : ${response.status}`);
    }

    const users = await response.json();

    // 3. Chercher l'utilisateur correspondant (email et mot de passe)
    const userFound = users.find(
      (user) => user.email === emailInput && user.password === passwordInput
    );

    if (userFound) {
      // 4. CONNEXION RÉUSSIE : Redirection
      console.log("Connexion réussie pour:", userFound.email);

      // STOCKAGE DU RÔLE  :
      // Utilisation de localStorage pour garder l'état de connexion et le rôle même après rafraîchissement
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", userFound.role); // <-- NOUVEAU : Stocke le rôle
      localStorage.setItem("userEmail", userFound.email);

      // Redirection vers la page d'acceuil
      window.location.href = "index.html";
    } else {
      // 5. CONNEXION ÉCHOUÉE : Afficher un message d'erreur
      errorDisplay.textContent = "Email ou mot de passe incorrect.";
      errorDisplay.classList.remove("d-none");
    }
  } catch (error) {
    // Gérer les erreurs de réseau ou de parsing JSON
    console.error("Erreur de connexion:", error);
    errorDisplay.textContent =
      "Une erreur est survenue lors de la vérification. Veuillez réessayer.";
    errorDisplay.classList.remove("d-none");
  }
}

// ===================================
// FONCTION GLOBALE D'AFFICHAGE D'ALERTE
// ===================================

/**
 * Affiche un message d'alerte temporaire sur la page.
 * Nécessite un div <div id="alert-message"></div> dans le HTML.
 * @param {string} message - Le texte de l'alerte.
 * @param {number} duration - La durée d'affichage en millisecondes (par défaut 3000ms).
 */
function displayAlert(message, duration = 3000) {
  const alertDiv = document.getElementById("alert-message");

  // Si l'élément n'existe pas, on log l'erreur pour le développeur
  if (!alertDiv) {
    console.error(
      "L'élément #alert-message n'existe pas. Veuillez l'ajouter au HTML."
    );
    return;
  }

  // Assurez-vous que le message est visible
  alertDiv.textContent = message;
  alertDiv.style.opacity = 1;
  alertDiv.style.visibility = "visible";

  // Masquer le message après la durée spécifiée
  setTimeout(() => {
    alertDiv.style.opacity = 0;
    // On attend la fin de la transition CSS pour cacher complètement
    setTimeout(() => {
      alertDiv.style.visibility = "hidden";
      alertDiv.textContent = "";
    }, 500);
  }, duration);
}

function checkLoginAlert() {
  // Ancien code avec sessionStorage à enlever :
  // const loginSuccess = sessionStorage.getItem("loginSuccess");
  // const userEmail = sessionStorage.getItem("userEmail");

  // NOUVEAU CODE : Utilisation de localStorage (ou gardez sessionStorage si c'est ce qui est attendu)
  const loginSuccess = localStorage.getItem("isLoggedIn");
  const userEmail = localStorage.getItem("userEmail");

  // IMPORTANT : Nous n'effaçons plus userEmail et isLoggedIn,
  // car ils sont utilisés par le nouveau code pour gérer l'état de connexion.

  // Pour que l'alerte ne s'affiche qu'une fois après la connexion,
  // nous allons stocker un flag spécifique.
  const hasAlerted = sessionStorage.getItem("hasAlerted");

  if (loginSuccess === "true" && !hasAlerted) {
    // Mettre un flag pour ne plus afficher l'alerte
    sessionStorage.setItem("hasAlerted", "true");

    // 2. Préparer le message
    const message = userEmail
      ? `Connexion réussie ! Bienvenue, ${userEmail}.`
      : "Connexion réussie !";

    // 3. Afficher l'alerte (avec votre fonction displayAlert)
    displayAlert(message, 4000); //
  }
}
// ===================================
// ÉCOUTEUR GLOBAL DOMContentLoaded
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Récupérer le formulaire de connexion (seulement sur la page connexion.html)
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  // Nouvelle étape : Mise à jour de la barre de navigation
  updateNavLinks();
  // ===========================================
  // NOUVEAU : Écouteur pour le lien de déconnexion
  // ===========================================
  const logoutLink = document.getElementById("nav-logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }
  // ===========================================
  // 2. Vérifier si on est sur la page calendrier.html et si une connexion a eu lieu
  // Cette fonction s'exécutera sur TOUTES les pages, mais agira seulement sur calendrier.html
  // après une connexion, grâce à la vérification de sessionStorage.
  checkLoginAlert();
  // ===============================================
  // *** NOUVEAU : Initialisation du Calendrier ***
  // ===============================================
  const container = document.querySelector(".container");
  // On assume que le calendrier est la fonctionnalité principale de cette page
  if (container && window.location.pathname.includes("calendrier.html")) {
    // Afficher le calendrier pour le mois en cours
    renderCalendar(new Date());

    // Mise à jour du titre
    const h1Title = document.querySelector("h1");
    if (h1Title) {
      h1Title.textContent = "Calendrier des Présences";
    }
  }
});

// Clé pour stocker les demandes de présence dans localStorage
const PRESENCE_STORAGE_KEY = "userPresenceRequests";

// Récupère les demandes stockées ou initialise un objet vide.
function getPresenceRequests() {
  const storedRequests = localStorage.getItem(PRESENCE_STORAGE_KEY);
  return storedRequests ? JSON.parse(storedRequests) : {};
}

// Sauvegarde l'état actuel des demandes.
function savePresenceRequests(requests) {
  localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(requests));
}
/**
 * Génère le calendrier pour le mois et l'année en cours.
 * @param {Date} targetDate - Le mois et l'année à afficher.
 */
function renderCalendar(targetDate) {
  const container = document.querySelector(".container");
  if (!container) return;

  // Réinitialiser le conteneur
  container.innerHTML = "";

  // Initialiser les dates
  const today = new Date();
  const currentMonth = targetDate.getMonth();
  const currentYear = targetDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Dim, 1=Lun...
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Récupérer l'état actuel de l'utilisateur
  const presenceRequests = getPresenceRequests();

  // Titre du mois
  const monthName = targetDate.toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const calendarHTML = `
        <h2 class="text-center text-primary mb-3">${
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        }</h2>
        <div class="calendar-grid">
            <div class="day-name">Lun</div>
            <div class="day-name">Mar</div>
            <div class="day-name">Mer</div>
            <div class="day-name">Jeu</div>
            <div class="day-name">Ven</div>
            <div class="day-name">Sam</div>
            <div class="day-name">Dim</div>
        </div>
        <div class="calendar-grid" id="calendarDays">
            </div>
    `;
  container.innerHTML = calendarHTML;
  const daysGrid = document.getElementById("calendarDays");

  // Ajustement du décalage (Débuter à Lundi)
  // getDay() donne 0 pour Dimanche. Nous voulons 0 pour Lundi.
  let startDayIndex = firstDay === 0 ? 6 : firstDay - 1;

  // Ajouter les jours vides pour le décalage
  for (let i = 0; i < startDayIndex; i++) {
    daysGrid.innerHTML += `<div class="day empty-day"></div>`;
  }

  // Ajouter les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const dayDate = new Date(currentYear, currentMonth, day);

    const isPast =
      dayDate < today && dayDate.toDateString() !== today.toDateString();
    const requestState = presenceRequests[fullDate] || "none"; // 'none', 'requested'

    let buttonClass = "btn-success";
    let buttonText = "Demander";
    let cellClass = "";

    if (isPast) {
      buttonClass = "btn-danger disabled";
      buttonText = "Passé";
      cellClass = "day-past";
    } else if (requestState === "requested") {
      buttonClass = "btn-warning";
      buttonText = "Annuler";
    }

    // Structure de la cellule du jour
    daysGrid.innerHTML += `
            <div class="day ${cellClass} ${
      dayDate.toDateString() === today.toDateString() ? "day-today" : ""
    }">
                <div class="day-number">${day}</div>
                <button 
                    class="btn btn-sm ${buttonClass} presence-toggle" 
                    data-date="${fullDate}" 
                    ${isPast ? "disabled" : ""}
                >
                    ${buttonText}
                </button>
            </div>
        `;
  }

  // Ajouter l'écouteur d'événement après la génération
  attachCalendarListeners();
}

/**
 * Attache l'écouteur d'événement à tous les boutons de présence.
 */
function attachCalendarListeners() {
  document.querySelectorAll(".presence-toggle").forEach((button) => {
    button.addEventListener("click", handlePresenceToggle);
  });
}

/**
 * Gère le clic sur le bouton de demande/annulation.
 * @param {Event} event
 */
function handlePresenceToggle(event) {
  const button = event.target;
  const date = button.getAttribute("data-date");
  let requests = getPresenceRequests();
  let message = "";

  // Toggle l'état de la demande
  if (requests[date] === "requested") {
    delete requests[date]; // Annuler la demande
    message = `Demande de présence annulée pour le ${date}.`;
    button.className = "btn btn-sm btn-success presence-toggle";
    button.textContent = "Demander";
  } else {
    requests[date] = "requested"; // Faire une demande
    message = `Demande de présence envoyée pour le ${date}.`;
    button.className = "btn btn-sm btn-warning presence-toggle";
    button.textContent = "Annuler";
  }

  savePresenceRequests(requests);
  const alertElement = document.getElementById("alert-message");
  if (alertElement) {
    alertElement.scrollIntoView({
      behavior: "smooth", // Rend le défilement plus agréable
      block: "start", // Assure que l'élément est aligné en haut de la fenêtre
    });
  }
  displayAlert(message, 4000);
}

function updateNavLinks() {
  const navBarNav = document
    .getElementById("navbarNavAltMarkup")
    .querySelector(".navbar-nav");

  // Récupérer les liens existants
  const accueilLink = document.querySelector('a[href="index.html"]');
  const connexionLink = document.querySelector('a[href="connexion.html"]');
  const inscriptionLink = document.querySelector('a[href="inscription.html"]');
  let calendarLink = document.querySelector('a[href="calendrier.html"]');
  const backofficeLink = document.getElementById("nav-backoffice");
  let logoutLink = document.getElementById("nav-logout");

  // Récupérer le rôle et l'état de connexion depuis localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  // --- GESTION DU LIEN DE DÉCONNEXION ---
  if (isLoggedIn) {
    // Utilisateur connecté : masquer Connexion/Inscription
    if (connexionLink) connexionLink.style.display = "none";
    if (inscriptionLink) inscriptionLink.style.display = "none";

    // GESTION DU LIEN CALENDRIER (MODIFICATION CLÉ ICI)
    if (calendarLink) {
      if (userRole === "admin" || userRole === "moderator") {
        // Masquer le Calendrier pour les rôles administratifs
        calendarLink.style.display = "none";
      } else {
        // Afficher le Calendrier pour les utilisateurs standards (user)
        calendarLink.classList.remove("disabled");
        calendarLink.style.display = "block";
      }
    }

    // Si le lien de déconnexion n'existe pas, le créer et l'ajouter
    if (!logoutLink) {
      logoutLink = document.createElement("a");
      logoutLink.className = "nav-link";
      logoutLink.href = "#"; // Empêche la redirection par défaut
      logoutLink.id = "nav-logout";
      logoutLink.textContent = "Se déconnecter";

      navBarNav.appendChild(logoutLink);
    }

    // S'assurer qu'il est visible
    logoutLink.style.display = "block";

    // ATTENTION : L'écouteur doit être attaché MAINTENANT
    // (voir étape C. Attachement de l'écouteur de déconnexion)

    // Afficher le lien Backoffice si l'utilisateur est admin OU modérateur
    if (backofficeLink) {
      // J'ai mis à jour cette condition pour inclure les modérateurs comme demandé précédemment
      if (userRole === "admin" || userRole === "moderator") {
        backofficeLink.style.display = "block";
      } else {
        backofficeLink.style.display = "none";
      }
    }
  } else {
    // Utilisateur déconnecté : afficher Connexion/Inscription, masquer Déconnexion et Backoffice
    if (connexionLink) connexionLink.style.display = "block";
    if (inscriptionLink) inscriptionLink.style.display = "block";
    if (backofficeLink) backofficeLink.style.display = "none";

    // Masquer le lien de déconnexion s'il existe
    if (logoutLink) {
      logoutLink.style.display = "none";
    }
    // S'assurer que le lien Calendrier est désactivé si non connecté
    if (calendarLink) {
      calendarLink.classList.add("disabled");
    }
  }
}

// ===================================
// FONCTION DE DÉCONNEXION
// ===================================
function handleLogout(event) {
  event.preventDefault(); // Empêche le comportement par défaut du lien

  // 1. Suppression de toutes les clés de connexion de localStorage
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");

  // 2. Suppression des flags d'alerte de sessionStorage
  sessionStorage.removeItem("hasAlerted");

  // 3. (Optionnel) Afficher une alerte de déconnexion
  displayAlert("Vous avez été déconnecté avec succès.", 3000);

  // 4. Redirection vers la page d'accueil ou de connexion
  // On attend un court instant pour laisser l'alerte s'afficher
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000); // 2s d'attente pour la transition de l'alerte
}

// Assurez-vous d'avoir les fonctions get/save qui interagissent avec localStorage
// ou votre source de données (si ce n'est pas le cas, utilisez celles que vous avez
// pour le calendrier, basées sur les demandes de présence stockées).

// --- (Fonctions getPresenceRequests, savePresenceRequests et displayAlert DOIVENT être présentes ici) ---

// 1. Fonction pour générer et afficher le tableau
function displayBackofficeRequests() {
  const requests = getPresenceRequests(); // Récupère toutes les demandes
  const container = document.getElementById("requests-table-container");
  let htmlContent = "";

  // Filtrer pour n'afficher que les demandes 'requested' (en attente de modération)
  const pendingRequests = Object.keys(requests).filter(
    (date) => requests[date] === "requested"
  );

  if (pendingRequests.length === 0) {
    htmlContent =
      '<div class="alert alert-success">Aucune demande de présence en attente de modération.</div>';
  } else {
    htmlContent = `
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Date de la Demande</th>
                        <th>Email </th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

    pendingRequests.forEach((date) => {
      // NOTE : Dans un vrai système, vous auriez le nom de l'utilisateur.
      // Ici, on utilise la date comme clé.
      htmlContent += `
                <tr id="request-${date}">
                    <td>${date}</td>
                    <td><span class="badge text-bg-warning">En Attente</span></td>
                    <td>
                        <button class="btn btn-sm btn-success me-2" onclick="handleAccept('${date}')">
                            Accepter
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="handleRefuse('${date}')">
                            Refuser
                        </button>
                    </td>
                </tr>
            `;
    });

    htmlContent += `
                </tbody>
            </table>
        `;
  }

  container.innerHTML = htmlContent;
}

// 2. Fonction pour Accepter une demande
function handleAccept(date) {
  let requests = getPresenceRequests();

  // Mettre à jour le statut dans les données
  requests[date] = "accepted"; // Nouveau statut
  savePresenceRequests(requests);

  // Mettre à jour l'affichage et informer l'utilisateur
  displayBackofficeRequests(); // Rafraîchit le tableau

  displayAlert("La demande de présence a été accepté avec succès.", 3000);
}

// 3. Fonction pour Refuser une demande
function handleRefuse(date) {
  let requests = getPresenceRequests();

  // Mettre à jour le statut dans les données
  requests[date] = "refused"; // Nouveau statut
  savePresenceRequests(requests);

  // Mettre à jour l'affichage et informer l'utilisateur
  displayBackofficeRequests(); // Rafraîchit le tableau
  displayAlert("La demande de présence a été refusé avec succès.", 3000);
}

// 4. Lancement de la fonction au chargement de la page si nous sommes sur backoffice.html
// Cette vérification est essentielle si script.js est utilisé sur plusieurs pages.
if (window.location.pathname.includes("backoffice.html")) {
  document.addEventListener("DOMContentLoaded", displayBackofficeRequests);
}
