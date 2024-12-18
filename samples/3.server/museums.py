def museumUrlOf(id) -> str :
    return museums[id]["searchUrl"]

def defaultMuseumId():
    return defaulId

defaulId = int(0)

museums = [
    {
        "id":1,
        "name":"metropolitan art of museum",
        "searchUrl":"https://collectionapi.metmuseum.org/public/collection/v1/"
    },
    {
        "id":2,
        "name":"Harvard museum",
        "searchUrl":""
    }
]