import React from "react";

const Pagination = ({nPages, currentPage, setCurrentPage})=>{
    const pageNumbers = [...Array(nPages+1).keys()].slice(1)
    const nextPage = () => {
        if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }
    return(
        <nav>
            <ul class='pagination' >
            <li class="page-item"><a class="page-link" href="#" onClick={prevPage} >
                Previous
                </a></li>            
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber} 
                        class= {`page-item ${currentPage === pgNumber ? 'active' : ''} `} >
                        <a onClick={() => setCurrentPage(pgNumber)} class="page-link"
                            href='#'>
                            {pgNumber}
                        </a>
                    </li>
                ))}
                <li class="page-item"><a class="page-link" href="#" onClick={nextPage}>Next</a></li>
            </ul>
        </nav>
    );
}
export default Pagination;