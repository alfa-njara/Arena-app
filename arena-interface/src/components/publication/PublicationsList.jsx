import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PublicationsList.css";
import { BsGlobeEuropeAfrica } from "react-icons/bs";

const staticData = [
  {
    companyName: "Arena Boutique",
    number: "0341234567",
    type: "Boutique",
    link: "https://example.com",
    description: "Vêtements tendance et accessoires de qualité.",
  },
  {
    companyName: "Pro Services",
    number: "0329876543",
    type: "Service",
    link: "https://example.com",
    description: "Services professionnels pour particuliers et entreprises.",
  },
  {
    companyName: "Fun Events",
    number: "0337711122",
    type: "Entertainment",
    link: "https://example.com",
    description: "Organisation d'événements et spectacles inoubliables.",
  },
  {
    companyName: "Learn Academy",
    number: "034556677",
    type: "Education",
    link: "https://example.com",
    description: "Formations et coaching pour tous niveaux.",
  },
  {
    companyName: "Tasty Food",
    number: "032448899",
    type: "Restauration",
    link: "https://example.com",
    description: "Restaurants et plats à emporter délicieux.",
  },
  {
    companyName: "Art & Culture Hub",
    number: "034332211",
    type: "Art & Culture",
    link: "https://example.com",
    description: "Expositions, ateliers et événements culturels.",
  },
  {
    companyName: "Wellness Center",
    number: "032778899",
    type: "Health & Wellness",
    link: "https://example.com",
    description: "Soins, bien-être et fitness pour tous.",
  },
];

const PublicationsList = () => {
  return (
    <div className="publications-page">
      <div className="container-fluid py-0 py-md-2">
        <div className="row g-4">
          {staticData.map((pub, idx) => (
            <div key={idx} className="col-md-6 col-lg-4">
              <div className="card publication-card h-100 shadow-sm">
                <div className="card-header-custom">
                  <div className="card-header-left">
                    <img
                      src={`https://i.pravatar.cc/150?img=${idx + 1}`}
                      alt="pdp"
                    />
                    <h5>{pub.companyName}</h5>
                  </div>
                  <span className="badge-type">{pub.type}</span>
                </div>
                <div className="card-body">
                  <p className="card-text">{pub.description}</p>
                </div>
                <div className="card-footer">
                  <small>📞 {pub.number}</small>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BsGlobeEuropeAfrica size={18} /> Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicationsList;
