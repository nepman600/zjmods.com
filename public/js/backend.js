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

function delClient(id)
{
    if(!(confirm('Are you sure?')))
        return

    fetch('/admin/client/delete/' + id, {
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

///////////////////////////////////////////////////////////////////////////
function searchClient(e, elm) {
    if (e.keyCode == 13) {
        //console.log(elm.value)
        window.location.href = '/admin/client/search/' + elm.value
    }
}

/*
$(document).ready(function () {
    $('input[name="search_client"]').on('keydown', function(e) {
        if (e.which == 13) {
            //e.preventDefault();
            console.log('enter')
        }
    });
})*/
