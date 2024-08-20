$(document).ready(function() {
    // Toggle sidebar on search icon click
    $("#search-icon").on("click", function() {
        $("#sidebar").toggleClass("sidebar-open sidebar-closed");
        $(".container-fluid").toggleClass("sidebar-open");
        $("#search-icon").toggleClass("icon-move-left");

        $("#message-area").toggleClass("col-md-8 col-md-4");
    });

    // Close sidebar on close button click
    $("#close-sidebar").on("click", function() {
        $("#sidebar").removeClass("sidebar-open").addClass("sidebar-closed");
        $(".container-fluid").removeClass("sidebar-open");
        $("#search-icon").removeClass("icon-move-left");
        $("#message-area").toggleClass("col-md-4 col-md-8");
    });

    // Close sidebar on clicking outside of it
    $(document).on("click", function(event) {
        if (!$(event.target).closest("#sidebar, #search-icon").length) {
            if ($("#sidebar").hasClass("sidebar-open")) {
                $("#sidebar").removeClass("sidebar-open").addClass("sidebar-closed");
                $(".container-fluid").removeClass("sidebar-open");
                $("#search-icon").removeClass("icon-move-left");
                $("#message-area").toggleClass("col-md-4 col-md-8");
            }
        }
    });
});


const searchInput = document.getElementById('searchInput');
const clearIcon = document.querySelector('.clear-icon');

searchInput.addEventListener('input', function() {
    if (searchInput.value) {
        clearIcon.style.display = 'block'; // Show icon when there is input
    } else {
        clearIcon.style.display = 'none'; // Hide icon when input is empty
    }
});

clearIcon.addEventListener('click', function() {
    searchInput.value = ''; // Clear the input field
    clearIcon.style.display = 'none'; // Hide the icon
    searchInput.focus(); // Optionally refocus the input field
});