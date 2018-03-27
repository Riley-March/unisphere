function calculateTime(postTime){
    var date = new Date();
    var currentTime = date.getTime();
    var seconds = Math.floor((currentTime - postTime) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (hours < 1 && minutes < 1) {
        if (seconds < 0){
            seconds = 0;
            postTime = seconds + "s";
        }
    } else if (hours < 1) {
        postTime = minutes + "m";
    } else if (hours < 24) {
        postTime = hours + "h";
    } else if (days < 365) {
        postTime = days + "d";
    } else {
        postTime = 1 + "y";
    }
    return postTime;
}