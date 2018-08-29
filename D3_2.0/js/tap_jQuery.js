//document ready function
$(function() {
    //waiting on click events
    $('.tab-panels .tabs li').on('click', function() {
        //this reverse to the element of the selector $('.tab-panels .tabs li').on('click'...
        //the syntax ...('click', function(){}) is call back syntax. The callb gets fired when the
        //outer function is done

        // assigns the variable panel the panel that the click was closest to
        //important if we have more than on panel

        //when ever a variable is referencing a jQuery selector the varibale should be marked with a "$" sign
        var $panel = $(this).closest('.tab-panels');

        //removing the active class from the li in tap-panels
        $panel.find('.tabs li.active').removeClass('active');
        //this references the clicked on tap
        $(this).addClass('active');

        //figure out which panel to show
        var panelToShow = $(this).attr('rel');



        //hide current panel
        $panel.find('.panel.active').slideUp(300, showNextPanel);

        //show next panel
        function showNextPanel() {
            // this refers to $panel.find('.panel.active')
            //removes the active class from the current active panel
            $(this).removeClass('active');

            //adds the class active to the panel that was clickt on
            $('#'+panelToShow).slideDown(300, function() {
                $(this).addClass('active');
            });

        }

        //activates the drawHourChart() function for the case that panel2 is active

        if(panelToShow.localeCompare('panel2')===0){
            console.log("panel2")
            dateHour = moment().locale('de');
            drawHourChart(0,2)
        }

        if (panelToShow.localeCompare('panel3')===0){
            console.log("panel3")
            dateDay = moment().locale('de');
            drawDayChart(0,0)
        }

        if (panelToShow.localeCompare('panel4')===0){
            console.log("panel4")
            dateMonth = moment().locale('de');
            drawMonthChart(0,0)
        }
    });


});