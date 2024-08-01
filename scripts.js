const BASE_URL = "https://gutendex.com/books";
const subjects = document.querySelector("#subjects");
const language = document.querySelector("#language");
const translators = document.querySelector("#translators");

document
    .getElementById("searchButton")
    .addEventListener("click", async (event) => {
        event.preventDefault();
        const query = document.getElementById("searchInput").value;
        if (query) {
            console.log(`Searching for: ${query}`);
            const books = await searchBooks(query);
            if (books) {
                displayResults(books);
            } else {
                console.error("No books found or error in fetching books");
            }
        } else {
            console.warn("Search query is empty");
        }
    });

const searchBooks = async (query) => {
    try {
        console.log(`${BASE_URL}?search=${query}`);
        const response = await fetch(`${BASE_URL}?search=${query}`);
        console.log("response", response);
        const data = await response.json();
        console.log("API Response:", data);
        return data.results;
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};
const convertToUpperCase = (str) => {
    if (!str) return str;
    return str.toUpperCase();
};

const displayResults = (books) => {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
    if (books && books.length > 0) {
        books.forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("result-item");
            bookElement.innerHTML = `
                <h2>${book.title}</h2>
                <p><strong>Authors:</strong> ${book.authors
                    .map((author) => author.name)
                    .join("; ")}</p>
               ${
                   subjects.checked
                       ? `<p><strong>Subjects: </strong>${
                             book.subjects
                                 ? book.subjects.join("; ")
                                 : "No subjects available."
                         }</p>`
                       : ""
               } 
                ${
                    language.checked
                        ? `<p><strong>Languages: </strong>${
                              book.languages
                                  ? book.languages
                                        .map((language) =>
                                            convertToUpperCase(language)
                                        )
                                        .join(", ")
                                  : "No languages available."
                          }</p>`
                        : ""
                }
                ${
                    translators.checked
                        ? `<p><strong>Translators: </strong>${
                              book.translators
                                  ? book.translators
                                        .map((translator) => translator.name)
                                        .join("; ")
                                  : "No translators available."
                          }</p>`
                        : ""
                }
                <a href="${
                    book.formats["text/html"] || book.formats["text/plain"]
                }" target="_blank">Read Book</a>
            `;
            resultsContainer.appendChild(bookElement);
        });
    } else {
        resultsContainer.innerHTML = "<p>No books found.</p>";
    }
};
