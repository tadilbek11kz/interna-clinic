import { useContext, useEffect } from 'react';
import './pagination.scss';
import PageContext from '../../contexts/pageContext';
import { useLocation } from 'react-router-dom';

const Pagination = ({ totalPages }) => {
    const { currentPage, handlePageChange, setPrevCurrentPage } = useContext(PageContext);
    let location = useLocation();

    useEffect(() => {
      console.log("CURRENT PAGE: " + currentPage)
    }, [currentPage])

    useEffect(() => {
      console.log("LOCATION: " + location.pathname)
    }, [location.pathname])
  
    return (
      <div className="pageSelectorMenu">
        <button className="pageSelectorButton" disabled={currentPage === 1} onClick={() => {setPrevCurrentPage(currentPage); handlePageChange(currentPage - 1);}}> {"<"} </button>
        <span className="pageStatus">{currentPage}</span>
        <button className="pageSelectorButton" disabled={currentPage === totalPages} onClick={() => {setPrevCurrentPage(currentPage); handlePageChange(currentPage + 1);}}> {">"} </button>
      </div>
    );
};
  
export default Pagination;  
