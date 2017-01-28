function delUser(id)
{
    if(!(confirm('Are you sure?')))
        return

    fetch('/admin/users/delete/' + id, {
        method: 'delete'
    }).then(function (response) {
        console.log(response)
        if(response.status == 200) window.location.reload()
    })
}