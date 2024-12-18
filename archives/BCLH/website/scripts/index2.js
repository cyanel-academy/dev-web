// Récupérer la liste des départements et remplir la liste déroulante
fetch("http://localhost:5000/department")
    .then(response => response.json())
    .then(data => {
        const categorySelect = document.getElementById("categorie-select");
        if (data.departments) {
            data.departments.forEach(department => {
                const option = document.createElement("option");
                option.value = department.departmentId; // ID du département
                option.textContent = department.displayName; // Nom du département
                categorySelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error("Erreur lors du chargement des départements :", error);
    });

// Ajouter un événement pour le clic sur le bouton "RECHERCHER"
document.getElementById("search-btn").addEventListener("click", function() {
    const selectedCategory = document.getElementById("categorie-select").value;
    const keywords = document.getElementById("keywords").value;

    if (!selectedCategory) {
        alert("Veuillez sélectionner une catégorie.");
        return;
    }

    // Faire une requête de recherche avec les paramètres appropriés
    fetch(`http://localhost:5000/search?category=${selectedCategory}&keywords=${keywords}`)
        .then(response => response.json())
        .then(data => {
            // Afficher les résultats dans la page
            const resultsList = document.getElementById("results-list");
            resultsList.innerHTML = ""; // Réinitialiser les résultats avant d'afficher les nouveaux

            if (data.length > 0) {
                // Pour chaque ID d'objet, on récupère les détails de l'objet
                data.forEach(objectID => {
                    fetch(`http://localhost:5000/object/${objectID}`)
                        .then(response => response.json())
                        .then(objectData => {
                            const li = document.createElement("li");
                            
                            li.innerHTML = `
                                    <article style="border: solid 1px">
                                        <h2><strong>${objectData.title}</strong></h2>
                                        <p>
                                            <img src="${objectData.primaryImageSmall}" alt="${objectData.title}" style="max-width: 200px; max-height: 200px;">
                                        </p>
                                    </article>
                            `;
                            resultsList.appendChild(li);
                        })
                        .catch(error => {
                            console.error("Erreur lors de la récupération des détails de l'objet :", error);
                        });
                });
            } else {
                resultsList.innerHTML = "<li>Aucun objet trouvé.</li>";
            }
        })
        .catch(error => {
            console.error("Erreur lors de la recherche des objets :", error);
        });
});
