<?php

if(gethostbyname("not-so-readymade-sanitizer-bot") === $_SERVER['REMOTE_ADDR']){
    echo file_get_contents('/flag.txt');
}else{
    echo "You're not bot bro";
}

