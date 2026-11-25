import React, { useEffect, useState } from "react";
import Card from "./Card";
import "./MagicCards.css";

const SCRYFALL_API_URL = "https://api.scryfall.com/cards/search";
const CARDS_PER_PAGE = 20;

const MagicCards = () => {
    const [displayedCards, setDisplayedCards] = useState([]);
    const [cardSearchTerm, setCardSearchTerm] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resultsHeading, setResultsHeading] = useState("Release Radar");

    const loadLatestCards = async () => {
        setIsLoading(true);
        setStatusMessage("");
        setResultsHeading("Release Radar");

        try {
            const apiResponse = await fetch(
                `${SCRYFALL_API_URL}?q=*&order=released&unique=cards&per_page=${CARDS_PER_PAGE}`
            );

            if (!apiResponse.ok) {
                throw new Error("Could not load newly released cards.");
            }

            const searchResults = await apiResponse.json();
            setDisplayedCards(searchResults.data.slice(0, CARDS_PER_PAGE));
        } catch (error) {
            console.error(error);
            setStatusMessage("Could not load newly released cards. Please try again.");
            setDisplayedCards([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLatestCards();
    }, []);

    const handleCardSearch = async (submitEvent) => {
        submitEvent.preventDefault();
        const normalizedSearchTerm = cardSearchTerm.trim();

        if (!normalizedSearchTerm) {
            await loadLatestCards();
            return;
        }

        setIsLoading(true);
        setStatusMessage("");
        setResultsHeading(`Search Results for "${normalizedSearchTerm}"`);

        try {
            const apiResponse = await fetch(
                `${SCRYFALL_API_URL}?q=${encodeURIComponent(normalizedSearchTerm)}&unique=cards&per_page=${CARDS_PER_PAGE}`
            );
            const searchResults = await apiResponse.json();

            if (!apiResponse.ok) {
                if (apiResponse.status === 404) {
                    setDisplayedCards([]);
                    setStatusMessage(`No cards found for "${normalizedSearchTerm}".`);
                    return;
                }
                throw new Error("Card search failed.");
            }

            setDisplayedCards(searchResults.data.slice(0, CARDS_PER_PAGE));
            if (searchResults.data.length === 0) {
                setStatusMessage(`No cards found for "${normalizedSearchTerm}".`);
            }
        } catch (error) {
            console.error(error);
            setDisplayedCards([]);
            setStatusMessage("Could not search for cards. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-4 magic-cards">
            <h1>The Card Case</h1>
            <img className="logo-image img-fluid mb-5" src="/logo.png" alt="The Card Case Logo" />

            <div className="row align-items-center g-3 mb-3">
                <div className="col-12 col-md-6">
                    <h2 className="mb-0">{resultsHeading}</h2>
                </div>
                <div className="col-12 col-md-6">
                    <form className="row g-2" onSubmit={handleCardSearch}>
                        <div className="col">
                            <input
                                id="search-input"
                                className="form-control"
                                type="text"
                                placeholder="Search Cards"
                                value={cardSearchTerm}
                                onChange={(changeEvent) => setCardSearchTerm(changeEvent.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary" id="search-button" type="submit">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isLoading && <p className="mb-3">Loading cards...</p>}
            {statusMessage && <p className="message mb-3">{statusMessage}</p>}

            {displayedCards.length > 0 && (
                <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 g-3">
                    {displayedCards.map((card) => (
                        <div className="col" key={card.id}>
                            <Card card={card} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MagicCards;
