onmessage = async function(e){
    var  url = e.data.url;

    var img = await fetch(`${url}`);
    
    var blobImg = await img.blob();
    
    self.postMessage({
        url:url,
        blob: blobImg,
    })
};