$(document).ready(function () {
    $('.banner-place').height($(window).height()-200)
    
    $('.download button').click(function() {
        $('#myModal').modal('show')
    })

    /////////////////////////////////////////////////
    $('.partner').click(function() {
        //console.log(this.id)
        fetch('/partner/click/' + this.id, {
            method: 'post',
            /*body: JSON.stringify({
             'name': 'zzz'
             }),*/
            credentials: "same-origin"
        }).then(function (response) {
            //console.log(response)
            //if(response.status == 200) window.location.reload()
            if(response.status == 200) window.location.href = '/extend'
        })
    })
})

