async function get(){
    var response = await fetch('../server/credentials/get.txt')
    var data  = await response.text()
    return data;
}
async function post(){
    var response = await fetch('../server/credentials/post.txt')
    var data  = await response.text()
    return data;
}
export {get,post}