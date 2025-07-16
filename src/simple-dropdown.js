// Simplified dropdown menu handling
$(document).ready(function() {
    console.log('Simple dropdown script loaded');
    
    // Handle main menu dropdowns
    $(document).on('mouseenter', '.nav-item.dropdown', function() {
        var $dropdown = $(this);
        console.log('Mouse enter on main menu:', $dropdown.find('.dropdown-toggle').text());
        
        // Hide other main menus
        $('.nav-item.dropdown').not($dropdown).removeClass('show');
        $('.dropdown-menu').removeClass('show');
        
        // Show current menu
        $dropdown.addClass('show');
        $dropdown.find('> .dropdown-menu').addClass('show');
    });
    
    $(document).on('mouseleave', '.nav-item.dropdown', function() {
        var $dropdown = $(this);
        setTimeout(function() {
            if (!$dropdown.is(':hover')) {
                $dropdown.removeClass('show');
                $dropdown.find('.dropdown-menu').removeClass('show');
            }
        }, 300);
    });
    
    // Handle dropdown menu hover to keep them open
    $(document).on('mouseenter', '.dropdown-menu', function() {
        // Keep menu open when hovering over it
    });
    
    $(document).on('mouseleave', '.dropdown-menu', function() {
        var $menu = $(this);
        var $dropdown = $menu.parent('.dropdown');
        
        setTimeout(function() {
            if (!$dropdown.is(':hover') && !$menu.is(':hover')) {
                $dropdown.removeClass('show');
                $menu.removeClass('show');
            }
        }, 300);
    });
    
    // Close dropdowns when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown').removeClass('show');
            $('.dropdown-menu').removeClass('show');
        }
    });
    
    // Close dropdowns with ESC key
    $(document).on('keydown', function(e) {
        if (e.keyCode === 27) {
            $('.dropdown').removeClass('show');
            $('.dropdown-menu').removeClass('show');
        }
    });
    
    // Search functionality
    const SEARCH_PAGE_SIZE = 5;
    let searchResults = [];
    let currentPage = 1;
    
    // Sample search index
    const searchIndex = [
        {title: "About AlcHepNet", url: "about.html", snippet: "Information about the Alcohol-associated Hepatitis Network project"},
        {title: "Eligibility Requirements", url: "eligibility.html", snippet: "Learn about participating in AlcHepNet studies"},
        {title: "Executive Summary", url: "executive-summary.html", snippet: "Overview of AlcHepNet research objectives and methods"},
        {title: "Publications", url: "publications.html", snippet: "List of publications and research papers from AlcHepNet"},
        {title: "Participating Institutions", url: "participating-institutions.html", snippet: "List of institutions participating in AlcHepNet"},
        {title: "Data Access", url: "data-system.html", snippet: "Information about accessing AlcHepNet data"},
        {title: "Clinical Studies", url: "itaald-eligibility.html", snippet: "Information about clinical studies and trials"},
        {title: "Biorepository", url: "team.html", snippet: "Information about the AlcHepNet biorepository"},
        {title: "Data Commons", url: "ardac.html", snippet: "Information about the AlcHepNet data commons"},
        {title: "Training Opportunities", url: "training-tlfb.html", snippet: "Training opportunities and resources"}
    ];
    
    function showSearchModal(results) {
        searchResults = results;
        currentPage = 1;
        updateSearchResults();
        $('#searchModal').modal('show');
    }
    
    function updateSearchResults() {
        const start = (currentPage - 1) * SEARCH_PAGE_SIZE;
        const end = start + SEARCH_PAGE_SIZE;
        const pageResults = searchResults.slice(start, end);
        
        let html = '';
        pageResults.forEach(item => {
            html += `<div class="search-result-item mb-3">
                <a href="${item.url}" class="h5 text-primary">${item.title}</a>
                <div class="text-muted small">${item.snippet}</div>
            </div>`;
        });
        
        if (html === '') {
            html = '<div class="text-center text-muted">No results found.</div>';
        }
        
        $('#searchResultsList').html(html);
        
        // Update pagination
        const totalPages = Math.ceil(searchResults.length / SEARCH_PAGE_SIZE);
        $('#pageInfo').text(`Page ${currentPage} of ${totalPages}`);
        $('#prevPage').prop('disabled', currentPage === 1);
        $('#nextPage').prop('disabled', currentPage === totalPages || totalPages === 0);
    }
    
    // Pagination button events
    $(document).on('click', '#prevPage', function() {
        if (currentPage > 1) {
            currentPage--;
            updateSearchResults();
        }
    });
    
    $(document).on('click', '#nextPage', function() {
        const totalPages = Math.ceil(searchResults.length / SEARCH_PAGE_SIZE);
        if (currentPage < totalPages) {
            currentPage++;
            updateSearchResults();
        }
    });
    
    // Search form submit event
    $(document).on('submit', '#searchForm', function(e) {
        e.preventDefault();
        const keyword = $('#searchInput').val().trim().toLowerCase();
        
        if (!keyword) {
            alert('Please enter a search term');
            return;
        }
        
        // Search through the index
        const results = searchIndex.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            item.snippet.toLowerCase().includes(keyword)
        );
        
        showSearchModal(results);
    });
    
    // Clear search input when modal is closed
    $('#searchModal').on('hidden.bs.modal', function() {
        $('#searchInput').val('');
    });
}); 