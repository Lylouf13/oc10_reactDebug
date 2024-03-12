import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Version en un seul bloc (pas de gestion du nombre de pages, donc potentiellement cassé au niveau du nombre de pages, ça doit être faisable de l'implémenter proprement ceci dit)

  // ---------------------------------------------
  // const filteredEvents = (data?.events || []).filter((event) => {
  //   if (!type ? type === null : type === event.type){
  //     return true;
  //   }
  //   return false;
  // }).filter((_, index) => { 
  //   if((currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index){
  //     return true
  //   }
  //   return false
  // });
  // ---------------------------------------------

  //
  // v Versions en Deux blocs v
  // -- ça me permet d'utiliser filteredEvents indépendemment pour générer le nombre de pages nécessaires en fonction du nombre d'éléments triés
  // -- displayedEvent récupère 9 éléments dans filteredEvents en fonction de currentPage(index = 0-8 pour currentPage =1, index = 9-17 pour currentPage=2 etc...)
  // -- et il est utilisé après en .map pour générer les éléments

  const filteredEvents = (data?.events || []).filter((event) => {
    if (!type ? type === null : type === event.type){
      return true;
    }
    return false;
  })
  const displayedEvents = (filteredEvents || []).filter((_, index) => { 
    if((currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index){
      return true
    }
    return false
  });

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Definit la quantite de pages a generer pour la categorie
  const pageNumber = (filteredEvents?.length || 0)%PER_PAGE === 0 ? 
    Math.floor((filteredEvents?.length || 0)/ PER_PAGE) : 
    Math.floor(((filteredEvents?.length || 0)/ PER_PAGE))+1;
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />

          <div id="events" className="ListContainer">
            {displayedEvents.map((event) => (
              <Modal key={`event-${event.id}`} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
