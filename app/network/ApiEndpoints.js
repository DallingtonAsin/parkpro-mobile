
let  ApiEndpoint = class{

    customer = {
        login: `customer/verify-otp`,
        register: `customer/register`,
        create_profile: `customer/profile/create`,
        update_profile: `customer/profile/update`,
        change_password: `customer/password/change`,
        update_profile_mage: `customer/change/profile-picture`,
        remove_profile_picture: `customer/profile/picture/remove`,
        get_notifications: `customer/notifications`,
        get_data: `customer/details`,
        send_otp: `customer/send-otp`,
        verify_otp: `customer/verify-otp`,
        topup: `customer/account/topup`,
        post_feedback: `customer/feedback`,
        post_app_details: `customer/app/details`,
        resend_otp: `customer/resend-otp`,
        change_pin: `customer/change-pin`,
        verify_change_phone_number: `customer/verify-change-phone-number`,
    }

    parking = {
        post_parking_request: 'device/parking-request',
        get_parking_requests: 'device/parking-request/myrequests',
        fetch_parking_areas: 'device/parking-areas',
        fetch_parking_spots: 'device/parking-spots',
        fetch_parking_fees: 'device/parking-area/fees',
        filter_parking_areas: 'parking-areas/search',
        fetch_parking_clients: 'clients',
        fetch_nearby_parkings: 'device/parking-area/near-by',
        fetch_top_rated_parkings: 'device/parking-area/top-rated',
        get_car_types: 'device/vehicle-category',
        fetch_parking_details: 'device/parking-area/find-by-id',
    }

    transaction= {
        fetch_history: 'customer/transaction/history',
        get_history: 'customer/transactions',
        get_order_details: 'device/parking-request/details',
    }

}

module.exports = ApiEndpoint