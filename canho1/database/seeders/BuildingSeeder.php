<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class BuildingSeeder extends Seeder
{
    public function run()
    {

        $addresses = [
            [
                "address" => "376 Trần Cao Vân, Phường Xuân Hà, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0713797,
                "lng" => 108.2001187,
            ],
            [
                "address" => "130 Trưng Nữ Vương, Phường Bình Thuận, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0582170,
                "lng" => 108.2207447,
            ],
            [
                "address" => "279 Hải Phòng, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0707542,
                "lng" => 108.2092543,
            ],
            [
                "address" => "80 Ông Ích Khiêm, Phường Thanh Bình, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0768325,
                "lng" => 108.2120316,
            ],
            [
                "address" => "81 Phạm Ngọc Thạch, Phường Hòa Khê, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0895782,
                "lng" => 108.2169896,
            ],
            [
                "address" => "123 Lê Lợi, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0749597,
                "lng" => 108.2199740,
            ],
            [
                "address" => "Trần Hưng Đạo, Phường An Hải Tây, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0617564,
                "lng" => 108.2303708,
            ],
            [
                "address" => "Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0617409,
                "lng" => 108.2241910,
            ],
            [
                "address" => "171 Lê Độ, Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0663525,
                "lng" => 108.2019752,
            ],
            [
                "address" => "77 Nguyễn Thái Học, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0681190,
                "lng" => 108.2207400,
            ],
            [
                "address" => "01 Đường Hoàng Hoa Thám, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0708170,
                "lng" => 108.2095886,
            ],
            [
                "address" => "08 Đường Hoàng Hoa Thám, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0706465,
                "lng" => 108.2093784,
            ],
            [
                "address" => "15 Đường Hoàng Hoa Thám, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0704264,
                "lng" => 108.2096385,
            ],
            [
                "address" => "35 Đường Hoàng Hoa Thám, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0700045,
                "lng" => 108.2097625,
            ],
            [
                "address" => "236 Hải Phòng, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0705797,
                "lng" => 108.2072662,
            ],
            [
                "address" => "12 Võ Văn Tần, Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0672283,
                "lng" => 108.2047003,
            ],
            [
                "address" => "218 Hồ Nghinh, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0666644,
                "lng" => 108.2430919,
            ],
            [
                "address" => "69 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0761324,
                "lng" => 108.2205151,
            ],
            [
                "address" => "411 Hải Phòng, Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0694212,
                "lng" => 108.2054387,
            ],
            [
                "address" => "316-318 Hải Phòng, Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0689110,
                "lng" => 108.2049831,
            ],
            [
                "address" => "Lô 13 Đường Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0835121,
                "lng" => 108.2476846,
            ],
            [
                "address" => "92 Đường Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0803548,
                "lng" => 108.2466261,
            ],
            [
                "address" => "169 Nguyễn Tất Thành, Phường Thanh Bình, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0820376,
                "lng" => 108.2125222,
            ],
            [
                "address" => "209 Trần Phú, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0648231,
                "lng" => 108.2235176,
            ],
            [
                "address" => "19 Lý Tự Trọng, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0775502,
                "lng" => 108.2217728,
            ],
            [
                "address" => "97b Đường Thái Thị Bôi, Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0681488,
                "lng" => 108.1987785,
            ],
            [
                "address" => "97 Đường Thái Thị Bôi, Phường Chính Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0681420,
                "lng" => 108.1986979,
            ],
            [
                "address" => "90 Châu Thị Vĩnh Tế, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
                "lat" => 16.0512342,
                "lng" => 108.2402260,
            ],
            [
                "address" => "24 Trần Quý Cáp, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0813246,
                "lng" => 108.2205894,
            ],
            [
                "address" => "35 Đường Lê Đình Lý, Phường Vĩnh Trung, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0582815,
                "lng" => 108.2115005,
            ],
            [
                "address" => "28 Đường Phan Đình Phùng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0705160,
                "lng" => 108.2220197,
            ],
            [
                "address" => "4 Phạm Văn Đồng, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0706100,
                "lng" => 108.2428955,
            ],
            [
                "address" => "53 Đường Morrison, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0716300,
                "lng" => 108.2427238,
            ],
            [
                "address" => "119 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0733632,
                "lng" => 108.2210314,
            ],
            [
                "address" => "02 Đường Hoàng Hoa Thám, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0707738,
                "lng" => 108.2093349,
            ],
            [
                "address" => "267 Dương Đình Nghệ, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0697237,
                "lng" => 108.2356103,
            ],
            [
                "address" => "103 Nguyễn Xuân Khoát, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0701474,
                "lng" => 108.2358848,
            ],
            [
                "address" => "631 Đường Trần Cao Vân, Phường Thanh Khê Đông, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0716462,
                "lng" => 108.1861689,
            ],
            [
                "address" => "109 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0745962,
                "lng" => 108.2206238,
            ],
            [
                "address" => "129 Lê Lợi, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0743882,
                "lng" => 108.2200866,
            ],
            [
                "address" => "426 Trần Cao Vân, Phường Tam Thuận, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0710650,
                "lng" => 108.1984644,
            ],
            [
                "address" => "441 Đường Ông Ích Khiêm, Phường Hải Châu 2, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0619829,
                "lng" => 108.2163479,
            ],
            [
                "address" => "Số 6 Đường Hoàng Quốc Việt, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0848495,
                "lng" => 108.2296619,
            ],
            [
                "address" => "2 Đường 3 Tháng 2, Phường Thuận Phước, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0829842,
                "lng" => 108.2225090,
            ],
            [
                "address" => "258 Nguyễn Văn Linh, Phường Thạch Gián, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0598008,
                "lng" => 108.2093536,
            ],
            [
                "address" => "35 Đàm Rong 1, Phường Hòa Cường Bắc, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0798652,
                "lng" => 108.2171610,
            ],
            [
                "address" => "165 Trần Hưng Đạo, Phường An Hải Tây, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0792103,
                "lng" => 108.2290755,
            ],
            [
                "address" => "233 Hồ Nghinh, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0669196,
                "lng" => 108.2433992,
            ],
            [
                "address" => "46 Thái Phiên, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0651331,
                "lng" => 108.2225171,
            ],
            [
                "address" => "7 Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0726661,
                "lng" => 108.2251645,
            ],
            [
                "address" => "493 Trần Hưng Đạo, Phường An Hải Tây, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0633056,
                "lng" => 108.2303205,
            ],
            [
                "address" => "74 Dương Đình Nghệ, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0690340,
                "lng" => 108.2374986,
            ],
            [
                "address" => "114 Nguyễn Văn Thoại, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
                "lat" => 16.0547381,
                "lng" => 108.2414037,
            ],
            [
                "address" => "202 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0686243,
                "lng" => 108.2449620,
            ],
            [
                "address" => "216 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0675260,
                "lng" => 108.2450110,
            ],
            [
                "address" => "122 Quang Trung, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0742620,
                "lng" => 108.2170832,
            ],
            [
                "address" => "87/16 Nguyễn Du, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0784606,
                "lng" => 108.2192030,
            ],
            [
                "address" => "208 Hà Huy Tập, Phường Hòa Khê, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0618673,
                "lng" => 108.1918179,
            ],
            [
                "address" => "16 Ba Đình, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0762132,
                "lng" => 108.2193113,
            ],
            [
                "address" => "19A Võ Văn Kiệt, Phường An Hải Đông, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0631470,
                "lng" => 108.2419488,
            ],
            [
                "address" => "231 Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0906234,
                "lng" => 108.2427901,
            ],
            [
                "address" => "87/4 Nguyễn Du, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0784588,
                "lng" => 108.2190936,
            ],
            [
                "address" => "54 Lê Lợi, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0785373,
                "lng" => 108.2194052,
            ],
            [
                "address" => "106 Hoàng Diệu, Phường Nam Dương, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0642464,
                "lng" => 108.2185815,
            ],
            [
                "address" => "144 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0672510,
                "lng" => 108.2209029,
            ],
            [
                "address" => "87 Hoàng Văn Thụ, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0629555,
                "lng" => 108.2195011,
            ],
            [
                "address" => "329 Dương Đình Nghệ, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0707582,
                "lng" => 108.2329541,
            ],
            [
                "address" => "59 Thái Phiên, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0650395,
                "lng" => 108.2219481,
            ],
            [
                "address" => "41 Lê Hồng Phong, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0639144,
                "lng" => 108.2212293,
            ],
            [
                "address" => "165 Hà Huy Tập, Phường Hòa Khê, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0638679,
                "lng" => 108.1920138,
            ],
            [
                "address" => "259/15 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0657749,
                "lng" => 108.2211071,
            ],
            [
                "address" => "64 Ung Văn Khiêm, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
                "lat" => 16.0513778,
                "lng" => 108.2406334,
            ],
            [
                "address" => "27/21 Thái Phiên, Phường Phước Ninh, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0643013,
                "lng" => 108.2229858,
            ],
            [
                "address" => "126 Hồ Nghinh, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0733954,
                "lng" => 108.2429536,
            ],
            [
                "address" => "56 Hoàng Bích Sơn, Phường Phước Mỹ, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0753828,
                "lng" => 108.2409602,
            ],
            [
                "address" => "234 Phan Châu Trinh, Phường Nam Dương, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0600295,
                "lng" => 108.2192703,
            ],
            [
                "address" => "47 Trưng Nữ Vương, Phường Bình Thuận, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0591070,
                "lng" => 108.2214952,
            ],
            [
                "address" => "30/1 Đặng Thai Mai, Phường Thanh Khê Đông, Quận Thanh Khê, Thành phố Đà Nẵng",
                "lat" => 16.0609388,
                "lng" => 108.2099353,
            ],
            [
                "address" => "22 Dương Đình Nghệ, Phường An Hải Bắc, Quận Sơn Trà, Thành phố Đà Nẵng",
                "lat" => 16.0688374,
                "lng" => 108.2416294,
            ],
            [
                "address" => "Châu Thị Vĩnh Tế, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
                "lat" => 16.0513235,
                "lng" => 108.2403147,
            ],
            [
                "address" => "64 An Thượng 20, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng",
                "lat" => 16.0514127,
                "lng" => 108.2405714,
            ],
            [
                "address" => "37 Ba Đình, Phường Thạch Thang, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0760522,
                "lng" => 108.2183879,
            ],
            [
                "address" => "19 Yên Bái, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0691035,
                "lng" => 108.2229133,
            ],
            [
                "address" => "18 Kiệt 113 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, Thành phố Đà Nẵng",
                "lat" => 16.0737653,
                "lng" => 108.2216024,
            ],
            [
                "address" => "42 Xô Viết Nghệ Tĩnh, Hoà Cường Nam, Hải Châu, Đà Nẵng",
                "lat" => 16.0319847,
                "lng" => 108.2158793,
            ],
            /// giả

            [
                'address' => 'Số 112 Đường Trần Phú, Phường Hải Châu, Quận Hải Châu',
                'lat' => 16.0682,
                'lng' => 108.2230,
            ],
            [
                'address' => 'Số 56 Đường Bạch Đằng, Phường Hải Châu, Quận Hải Châu',
                'lat' => 16.0695,
                'lng' => 108.2255,
            ],
            [
                'address' => 'Số 29 Đường Hùng Vương, Phường Hải Châu, Quận Hải Châu',
                'lat' => 16.0650,
                'lng' => 108.2201,
            ],

            [
                'address' => 'Số 10 Đường 2 Tháng 9, Phường Hòa Cường, Quận Hải Châu',
                'lat' => 16.0520,
                'lng' => 108.2160,
            ],
            [
                'address' => 'Số 42 Đường Tiểu La, Phường Hòa Cường, Quận Hải Châu',
                'lat' => 16.0498,
                'lng' => 108.2195,
            ],
            [
                'address' => 'Số 85 Đường Lê Thanh Nghị, Phường Hòa Cường, Quận Hải Châu',
                'lat' => 16.0550,
                'lng' => 108.2188,
            ],

            [
                'address' => 'Số 200 Đường Nguyễn Hữu Thọ, Phường Hòa Thuận, Quận Hải Châu',
                'lat' => 16.0415,
                'lng' => 108.2090,
            ],
            [
                'address' => 'Số 33 Đường Phan Đăng Lưu, Phường Hòa Thuận, Quận Hải Châu',
                'lat' => 16.0398,
                'lng' => 108.2125,
            ],
            [
                'address' => 'Số 105 Đường Cách Mạng Tháng 8, Phường Hòa Thuận, Quận Hải Châu',
                'lat' => 16.0402,
                'lng' => 108.2080,
            ],

            [
                'address' => 'Số 154 Đường Ngô Quyền, Phường Thọ Quang, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0847,
                'lng' => 108.2435,
            ],
            [
                'address' => 'Số 32 Đường Đinh Công Trứ, Phường Thọ Quang, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0880,
                'lng' => 108.2480,
            ],
            [
                'address' => 'Số 80 Đường Yết Kiêu, Phường Thọ Quang, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0855,
                'lng' => 108.2460,
            ],

            [
                'address' => 'Số 22 Đường Vân Đồn, Phường Nại Hiên Đông, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0750,
                'lng' => 108.2395,
            ],
            [
                'address' => 'Số 76 Đường Khúc Hạo, Phường Nại Hiên Đông, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0770,
                'lng' => 108.2380,
            ],
            [
                'address' => 'Số 102 Đường An Hải 3, Phường Nại Hiên Đông, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0725,
                'lng' => 108.2360,
            ],

            [
                'address' => 'Số 18 Đường Hồ Nghinh, Phường Mân Thái, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0755,
                'lng' => 108.2440,
            ],
            [
                'address' => 'Số 50 Đường Phạm Văn Đồng, Phường Mân Thái, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0778,
                'lng' => 108.2465,
            ],
            [
                'address' => 'Số 89 Đường Võ Văn Kiệt, Phường Mân Thái, Quận Sơn Trà , Thành phố Đà Nẵng',
                'lat' => 16.0730,
                'lng' => 108.2420,
            ],
            [
                'address' => 'Số 250 Đường Hà Khê, Phường An Khê, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0594,
                'lng' => 108.1882,
            ],
            [
                'address' => 'Số 86 Đường Lê Trọng Tấn, Phường An Khê, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0610,
                'lng' => 108.1905,
            ],
            [
                'address' => 'Số 19 Đường Trần Xuân Lê, Phường An Khê, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0585,
                'lng' => 108.1860,
            ],

            [
                'address' => 'Số 376 Trần Cao Vân, Phường Xuân Hà, Quận Thanh Khê, Thành phố Đà Nẵng',
                'lat' => 16.0713797,
                'lng' => 108.2001187,
            ],
            [
                'address' => 'Số 279 Hải Phòng, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng',
                'lat' => 16.0707542,
                'lng' => 108.2092543,
            ],
            [
                'address' => 'Số 18 Đường Trần Xuân Lê, Phường Xuân Hà, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0725,
                'lng' => 108.2015,
            ],

            [
                'address' => 'Số 120 Đường Nguyễn Tri Phương, Phường Vĩnh Trung, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0650,
                'lng' => 108.2090,
            ],
            [
                'address' => 'Số 55 Đường Hùng Vương, Phường Vĩnh Trung, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0680,
                'lng' => 108.2115,
            ],
            [
                'address' => 'Số 92 Đường Lê Duẩn, Phường Vĩnh Trung, Quận Thanh  Khê, Thành phố Đà Nẵng',
                'lat' => 16.0700,
                'lng' => 108.2130,
            ],

            [
                'address' => 'Số 120 Đường Cách Mạng Tháng Tám, Phường Khuê Trung, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0381,
                'lng' => 108.2045,
            ],
            [
                'address' => 'Số 45 Đường Nguyễn Hữu Thọ, Phường Khuê Trung, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0400,
                'lng' => 108.2080,
            ],
            [
                'address' => 'Số 22 Đường Phan Đăng Lưu, Phường Khuê Trung, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0360,
                'lng' => 108.2020,
            ],

            [
                'address' => 'Số 80 Đường Tôn Đản, Phường Hòa Phát, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0350,
                'lng' => 108.1880,
            ],
            [
                'address' => 'Số 112 Đường Lê Trọng Tấn, Phường Hòa Phát, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0325,
                'lng' => 108.1905,
            ],
            [
                'address' => 'Số 220 Đường Trường Chinh, Phường Hòa Phát, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0300,
                'lng' => 108.1920,
            ],
            [
                'address' => 'Số 150 Đường Trường Chinh, Phường Hòa An, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0150,
                'lng' => 108.1950,
            ],
            [
                'address' => 'Số 33 Đường Tôn Đản, Phường Hòa An, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0175,
                'lng' => 108.1930,
            ],
            [
                'address' => 'Số 89 Đường Mẹ Suốt, Phường Hòa An, Quận Cẩm Lệ, Thành phố Đà Nẵng',
                'lat' => 16.0120,
                'lng' => 108.1970,
            ],

            [
                'address' => 'Số 300 Đường Nguyễn Lương Bằng, Phường Hòa Hiệp Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.1080,
                'lng' => 108.1630,
            ],
            [
                'address' => 'Số 78 Đường Sư Vạn Hạnh, Phường Hòa Hiệp Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.1105,
                'lng' => 108.1655,
            ],
            [
                'address' => 'Số 15 Đường Tôn Đức Thắng, Phường Hòa Hiệp Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.1060,
                'lng' => 108.1600,
            ],

            [
                'address' => 'Số 50 Đường Nguyễn Lương Bằng, Phường Hòa Hiệp Nam, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.0980,
                'lng' => 108.1580,
            ],
            [
                'address' => 'Số 112 Đường Nguyễn Tất Thành, Phường Hòa Hiệp Nam, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.1005,
                'lng' => 108.1605,
            ],
            [
                'address' => 'Số 88 Đường Nam Cao, Phường Hòa Hiệp Nam, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.0960,
                'lng' => 108.1560,
            ],

            [
                'address' => 'Số 200 Đường Âu Cơ, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.0880,
                'lng' => 108.1500,
            ],
            [
                'address' => 'Số 45 Đường Hoàng Văn Thái, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.0905,
                'lng' => 108.1525,
            ],
            [
                'address' => 'Số 120 Đường Mẹ Suốt, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng',
                'lat' => 16.0860,
                'lng' => 108.1480,
            ],

            [
                'address' => 'Số 150 Đường Võ Nguyên Giáp, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0592,
                'lng' => 108.2435,
            ],
            [
                'address' => 'Số 22 Đường Nguyễn Văn Thoại, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0610,
                'lng' => 108.2450,
            ],
            [
                'address' => 'Số 88 Đường Hoàng Kế Viêm, Phường Mỹ An, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0575,
                'lng' => 108.2410,
            ],

            [
                'address' => 'Số 234 Đường Lê Văn Hiến, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0350,
                'lng' => 108.2300,
            ],
            [
                'address' => 'Số 56 Đường Hồ Xuân Hương, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0375,
                'lng' => 108.2325,
            ],
            [
                'address' => 'Số 98 Đường Mai Đăng Chơn, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0320,
                'lng' => 108.2280,
            ],

            [
                'address' => 'Số 300 Đường Võ Chí Công, Phường Hòa Quý, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0280,
                'lng' => 108.2150,
            ],
            [
                'address' => 'Số 77 Đường Mai Đăng Chơn, Phường Hòa Quý, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0305,
                'lng' => 108.2175,
            ],
            [
                'address' => 'Số 12 Đường Nam Kỳ Khởi Nghĩa, Phường Hòa Quý, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng',
                'lat' => 16.0260,
                'lng' => 108.2130,
            ],

            [
                'address' => 'Thôn An Ngãi Đông, Xã Hòa Bắc, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.1180,
                'lng' => 108.0650,
            ],
            [
                'address' => 'Thôn Hòa Hải, Xã Hòa Bắc, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.1205,
                'lng' => 108.0675,
            ],
            [
                'address' => 'Thôn Phò Nam, Xã Hòa Bắc, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.1160,
                'lng' => 108.0620,
            ],

            [
                'address' => 'Thôn Liên Trì, Xã Hòa Liên, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.1080,
                'lng' => 108.1050,
            ],
            [
                'address' => 'Thôn Quan Nam, Xã Hòa Liên, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.1105,
                'lng' => 108.1075,
            ],
            [
                'address' => 'Thôn Trung Sơn, Xã Hòa Liên, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.1060,
                'lng' => 108.1030,
            ],

            [
                'address' => 'Thôn Hòa Phước, Xã Hòa Ninh, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.0880,
                'lng' => 108.0850,
            ],
            [
                'address' => 'Thôn Phước Thượng, Xã Hòa Ninh, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.0905,
                'lng' => 108.0875,
            ],
            [
                'address' => 'Thôn Hòa Bình, Xã Hòa Ninh, Huyện Hòa Vang, Thành phố Đà Nẵng',
                'lat' => 16.0860,
                'lng' => 108.0830,
            ],
            
        ];

        // Lấy danh sách id user để random chủ tòa
        $buildingNames = [
            "Sunrise Tower",
            "Riverside Residence",
            "Ocean View",
            "Skyline Plaza",
            "Green Park Tower",
            "Golden Land",
            "Harmony Building",
            "Blue Ocean Tower",
            "Diamond Plaza",
            "Central Park Residence",
            "Royal Garden",
            "Victory Tower",
            "Oriental Pearl",
            "City Light",
            "Dragon Tower",
            "Evergreen Plaza",
            "Lotus Building",
            "Grand Riverside",
            "Pearl Tower",
            "Metro Center"
        ];

        $userIds = User::pluck('id')->toArray();

        foreach ($addresses as $address) {
            DB::table('buildings')->insert([
                'owner_id' => $userIds[array_rand($userIds)],
                'name' => $buildingNames[array_rand($buildingNames)],
                'address' => $address['address'],
                'lat' => $address['lat'],
                'lng' => $address['lng'],
                'floors' => rand(5, 30),
                'description' => 'Tòa nhà ' . $address['address'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        }
    }

}