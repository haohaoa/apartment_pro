<?php

namespace App\Services;
use Carbon\Carbon;
class OpenAIFunctions
{
    /**
     * Danh sách function dùng cho GPT model
     */
    public static function definitions(): array
    {
        $now = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d H:i');
        return [

            [
                'name' => 'findNearbyApartment',
                'description' => 'Tìm căn hộ gần một địa danh hoặc khu vực cụ thể.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'mess' => [
                            'type' => 'string',
                            'description' => 'Nội dung trả lời tự nhiên cho người dùng'
                        ],
                        'location' => [
                            'type' => 'string',
                            'description' => 'Địa chỉ hoặc địa danh (VD: "Cầu Rồng", "Hòa Cường Nam")'
                        ],
                        'price_min' => [
                            'type' => 'number',
                            'description' => 'Giá thấp nhất căn hộ theo khoảng giá người dùng nói (ví dụ nếu người dùng nói "5 triệu", sẽ là 4).'
                        ],
                        'price_max' => [
                            'type' => 'number',
                            'description' => 'Giá cao nhất căn hộ theo khoảng giá người dùng nói (ví dụ nếu người dùng nói "5 triệu", sẽ là 6).'
                        ],
                        'number_of_people' => [
                            'type' => 'number',
                            'description' => 'Số người ở'
                        ],
                        'bedrooms' => [
                            'type' => 'number',
                            'description' => 'Số phòng ngủ'
                        ],
                        'amenities' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                            'description' => 'Các tiện ích như wifi, máy lạnh, gần siêu thị, chỗ để xe, ban công, gần biển'
                        ],
                        'duration' => [
                            'type' => 'string',
                            'description' => 'Thời gian thuê (ví dụ: "6 tháng", "dài hạn")'
                        ],
                    ],
                ],
            ],
            [
                'name' => 'searchApartment',
                'description' => 'Tìm căn hộ theo địa chỉ, quận, phường hoặc tên đường.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'mess' => [
                            'type' => 'string',
                            'description' => 'Nội dung trả lời tự nhiên cho người dùng'
                        ],
                        'location' => ['type' => 'string'],
                        'price_min' => ['type' => 'number'],
                        'price_max' => ['type' => 'number'],
                        'number_of_people' => ['type' => 'number'],
                        'bedrooms' => ['type' => 'number'],
                        'amenities' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'findApartmentByName',
                'description' => 'tìm căn hộ theo tên tòa nhà',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'mess' => [
                            'type' => 'string',
                            'description' => 'Nội dung phản hồi tự nhiên cho người dùng, ví dụ: "Tôi sẽ tìm căn hộ trong tòa MMB cho bạn nhé."'
                        ],
                        'apartment_name' => ['type' => 'string'],
                    ],
                    'required' => ['apartment_name'],
                ],
            ],
            [
                'name' => 'createViewingSchedule',
                'description' => 'Dùng khi người dùng muốn đặt lịch xem một căn hộ cụ thể.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'mess' => [
                            'type' => 'string',
                            'description' => 'Câu phản hồi tự nhiên gửi lại cho người dùng, giọng thân thiện, rõ ràng. Nội dung cần thông báo rằng lịch hẹn đã được đặt thành công và thông tin chi tiết sẽ được gửi về email của khách. Ví dụ: "Ok, tôi đã đặt lịch xem căn hộ Lotus cho bạn vào ngày mai lúc 10h nhé! Thông tin chi tiết lịch hẹn sẽ được gửi về email của bạn."'
                        ],
                        'apartment_id' => [
                            'type' => 'string',
                            'description' => 'ID của căn hộ mà khách muốn xem. Hệ thống sẽ tự xác định ID này từ danh sách căn hộ mà người dùng vừa xem hoặc chọn.'
                        ],
                        'note' => [
                            'type' => 'string',
                            'description' => 'Ghi chú thêm của khách hàng khi đặt lịch, ví dụ: "Tôi muốn xem vào buổi sáng" hoặc "Đi cùng 2 người bạn". Có thể để trống.'
                        ],
                        'date' => [
                            'description' => "Ngày và giờ khách muốn xem căn hộ, theo múi giờ Việt Nam (GMT+7). Hôm nay là {$now}. " .
                                'Định dạng "YYYY-MM-DD HH:mm" hoặc chuỗi tự nhiên (ví dụ: "2025-10-20 10:00", "chiều mai lúc 3h", "sáng thứ hai tuần sau").',
                        ],
                    ],
                    'required' => ['apartment_id', 'date'],
                ],
            ],
            [
                'name' => 'deleteViewingSchedule',
                'description' => 'Người dùng muốn hủy lịch xem căn hộ đã đặt trước đó.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'mess' => [
                            'type' => 'string',
                            'description' => 'Câu phản hồi tự nhiên gửi lại cho người dùng, giọng thân thiện, rõ ràng. Nội dung cần thông báo rằng lịch xem đã được hủy thành công, kèm lời xác nhận. Ví dụ: "Tôi đã hủy lịch xem căn hộ Lotus cho bạn rồi nhé. Nếu muốn đặt lại lịch mới, bạn chỉ cần nói với tôi thời gian mong muốn!"'
                        ],
                        'apartment_id' => [
                            'type' => 'string',
                            'description' => 'ID của căn hộ mà người dùng muốn hủy lịch xem. Hệ thống sẽ tự động xác định ID này dựa trên lịch xem đã được đặt gần đây nhất hoặc căn hộ mà người dùng đang yêu cầu hủy.'
                        ],
                    ],
                    'required' => ['apartment_id'],
                ],
            ],

        ];
    }

    /**
     * Trả về function_call phù hợp với mục đích
     * (ép model chỉ gọi đúng 1 function)
     */
    public static function getFunctionCall(?string $type = null): array|string
    {
        return match ($type) {
            'nearby' => ['name' => 'findNearbyApartment'],
            'search' => ['name' => 'searchApartment'],
            'by_name' => ['name' => 'findApartmentByName'],
            default => 'auto', // cho model tự chọn
        };
    }
}
