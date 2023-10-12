$(".addmore").click(function () { 
          
    // Select the element that 
    // is clicked on 
    let curr_elem = $(".decor"); 

    // Set the amount to increase 
    let increase_modifier = 1.5; 

    // Get the current width of the element 
    // and parse the value to integer 
    let curr_width =  
        parseInt(curr_elem.css("width"), 10); 

    // Get the current height of the element 
    // and parse the value to integer 
    let curr_height =  
        parseInt(curr_elem.css("height"), 10); 

    // Set the CSS value of the element 
    curr_elem.css({ 
      // Set the new height and width 
      // after multiplying 
      width: curr_width * increase_modifier, 
      height: curr_height * increase_modifier, 
    }); 
  }); 