let answer = "";
function helloworld() {
    if (String(document.getElementsByClassName("a4cQT")[0].attributes[0].value) === "LM3KPc"){
        let wrapperAncestorClass = document.getElementsByClassName("a4cQT")[0];
        let wrapperParentClass;
        if (wrapperAncestorClass.children){
            wrapperParentClass = wrapperAncestorClass.children;
        } else {
            return;
        }
        for (wrapperClass of wrapperParentClass){
            if (wrapperClass.getAttribute("class") === "TBMuR"){
                if (wrapperClass.children){
                    if (wrapperClass.children[1].getAttribute("class") === "zs7s8d" && wrapperClass.children[1].innerHTML === "You"){
                        if (wrapperClass.children[2].getAttribute("class") === "Mz6pEf"){
                            console.log(wrapperClass.children[2]);
                            if (wrapperClass.children[2].children[0].getAttribute("class") === "iTTPOb"){
                                console.log(wrapperClass.children[2]);
                                let transcriptMessages = wrapperClass.children[2].children[0].children;
                                for (transcriptMessage of transcriptMessages){
                                    answer = answer.concat(String(transcriptMessage.children[0].innerText))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
helloworld();
console.log("YAY!", answer);
