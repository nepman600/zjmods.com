function delUser(id)
{
    if(!(confirm('Are you sure?')))
        return

    fetch('/admin/users/delete/' + id, {
        method: 'delete',
        /*body: JSON.stringify({
            'name': 'zzz'
        }),*/
        credentials: "same-origin"
    }).then(function (response) {
        //console.log(response)
        if(response.status == 200) window.location.reload()
    })
}

function delBanner(id)
{
    if(!(confirm('Are you sure?')))
        return

    fetch('/admin/banner/delete/' + id, {
        method: 'delete',
        /*body: JSON.stringify({
            'name': 'zzz'
        }),*/
        credentials: "same-origin"
    }).then(function (response) {
        //console.log(response)
        if(response.status == 200) window.location.reload()
    })
}

function delPartner(id)
{
    if(!(confirm('Are you sure?')))
        return

    fetch('/admin/partner/delete/' + id, {
        method: 'delete',
        /*body: JSON.stringify({
         'name': 'zzz'
         }),*/
        credentials: "same-origin"
    }).then(function (response) {
        //console.log(response)
        if(response.status == 200) window.location.reload()
    })
}