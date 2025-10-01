function changeContent(clickedButton, contentID)
{
    let buttons = document.querySelectorAll(".tabs button");
    let contents = document.querySelectorAll(".content");

    buttons.forEach((button) => {
        button.disabled = false;
    });

    contents.forEach((elem) => {
        elem.style.display = "none";
    })

    document.getElementById(contentID).style.display = "block";
    clickedButton.disabled = true;
}