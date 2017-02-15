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

    //banners
    var banners = JSON.parse($('#banners').text())
    for(var i = 0; i < banners.length; i++) {
        //console.log(i, banners[i])
        if( ( i + 1 ) % 2 ) {
            $('.banners-l').append('<div class="banner"><img src="../upload/banners/' + banners[i].img + '"></div>')
        }
        else {
            $('.banners-r').append('<div class="banner"><img src="../upload/banners/' + banners[i].img + '"></div>')
        }
    }

})

function donate(agregator) {
    if($('#pay_method').val() == 'paypal')
        document.getElementById('pp_form').submit();
    else {
        var amount = prompt('Сколько не жалко?', 100);
        if(parseInt(amount) > 0) {
            if($('#pay_method').val() == 'w1') {
                $('[name="WMI_PAYMENT_AMOUNT"]').val(amount);
                document.getElementById('form_w1').submit();
            }
            else {
                $('[name="sum"]').val(amount);
                document.getElementById('form_yandex_pay').submit();
            }
        }
    }
}
