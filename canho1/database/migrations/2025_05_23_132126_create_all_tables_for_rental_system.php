<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllTablesForRentalSystem extends Migration
{
    public function up()
    {
        // Bảng 'buildings' lưu thông tin tòa nhà
        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('name'); // Tên tòa nhà
            $table->string('address'); // Địa chỉ
            $table->decimal('lat', 10, 7)->nullable(); // Vĩ độ
            $table->decimal('lng', 10, 7)->nullable(); // Kinh độ
            $table->unsignedInteger('floors')->nullable(); // Số tầng
            $table->text('description')->nullable(); // Mô tả chi tiết
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // Bảng 'apartments' lưu thông tin căn hộ được đăng cho thuê
        Schema::create('apartments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained('buildings')->onDelete('cascade');
            // Liên kết tới chủ nhà (users.id), xóa cascade khi chủ bị xóa
            $table->string('title'); // Tiêu đề căn hộ
            $table->text('description')->nullable(); // Mô tả chi tiết căn hộ
            $table->string('address'); // Địa chỉ căn hộ
            $table->decimal('price', 10, 2); // Giá thuê (ví dụ 1500.00)
            $table->decimal('deposit', 10, 2); // Tiền đặt cọc
            $table->enum('status', ['available', 'rented'])->default('available');
            // Trạng thái căn hộ: available = còn trống, rented = đã cho thuê
            $table->timestamps();
        });

        // Bảng 'apartment_images' lưu đường dẫn hình ảnh của từng căn hộ
        Schema::create('apartment_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apartment_id')->constrained('apartments')->onDelete('cascade');
            // Liên kết đến căn hộ, xóa hình ảnh khi căn hộ bị xóa
            $table->string('image_url'); // Đường dẫn hình ảnh
            $table->timestamps();
        });

        // Bảng 'rental_orders' lưu thông tin các đơn thuê căn hộ
        Schema::create('rental_orders', function (Blueprint $table) {
            $table->id();
            // Người thuê
            $table->foreignId(column: 'user_id')->constrained('users')->onDelete('cascade');
            // Căn hộ được thuê
            $table->foreignId('apartment_id')->constrained('apartments')->onDelete('cascade');
            // Chủ nhà (owner) liên kết trực tiếp đến users
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            // Ngày bắt đầu và kết thúc thuê
            $table->date('start_date');
            $table->date('end_date');
            // Trạng thái đơn thuê
            $table->enum('status', [
                'pending',   // Hợp đồng / đơn thuê đang chờ xử lý (chưa duyệt)
                'approved',  // Đã được chủ nhà / hệ thống phê duyệt (có hiệu lực nhưng chưa hoàn tất)
                'rejected',  // Bị từ chối (không hợp lệ hoặc chủ nhà không đồng ý)
                'completed', // Hợp đồng đã hoàn thành (kết thúc đúng hạn, thanh toán đầy đủ)
                'check_out', // Người thuê đã trả nhà (thủ tục trả căn hộ / kết thúc thuê sớm)
            ])->default('pending');

            $table->timestamps();
        });


        // Bảng 'payments' lưu thông tin thanh toán cho các đơn thuê
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_order_id')->constrained('rental_orders')->onDelete('cascade');

            $table->decimal('amount', 12, 2)->default(0); // Số tiền đã thanh toán (0 nếu chưa thanh toán)
            $table->decimal('total_price', 12, 2); // Tổng tiền thuê kỳ đó

            // Kỳ thanh toán
            $table->date('period_start')->nullable(); // Ngày bắt đầu kỳ
            $table->date('period_end')->nullable();   // Ngày kết thúc kỳ

            $table->dateTime('payment_date')->nullable(); // Ngày thanh toán thực tế (null nếu chưa trả)

            // (Có thể giữ lại để thống kê)
            $table->unsignedTinyInteger('month')->nullable();
            $table->unsignedSmallInteger('year')->nullable();

            $table->enum('method', ['bank', 'cash', 'e-wallet'])->nullable(); // Có thể null nếu chưa thanh toán
            $table->enum('status', ['paid', 'unpaid', 'failed', 'pending_confirmation'])->default('unpaid');
            $table->timestamps();

            $table->unique(['rental_order_id', 'period_start']); // tránh trùng kỳ
        });

        // Bảng 'viewing_schedules' lưu lịch hẹn xem căn hộ
        Schema::create('viewing_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apartment_id')->constrained('apartments')->onDelete('cascade');
            // Liên kết đến căn hộ cần xem

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // Người đặt lịch xem (người dùng)

            $table->dateTime('scheduled_at'); // Thời gian hẹn xem phòng
            // 🕔 Thời gian hết hạn cho việc ký hợp đồng (sau khi xem)
            $table->dateTime('deadline')->nullable();
            $table->enum('status', [
                'pending',   // Đang xử lý
                'viewed',    // Khách đã xem phòng
                'cancelled', // Đã hủy
                'booking', // đã đặt
            ])->default('pending');            // Trạng thái lịch hẹn: chờ xác nhận, đã xác nhận, hủy, đã xem xong

            $table->text('note')->nullable(); // Ghi chú thêm từ người đặt lịch (nếu có)
            $table->timestamps();
        });
        // Bảng 'rental_contracts' lưu thông tin hợp đồng thuê căn hộ
        Schema::create('rental_contracts', function (Blueprint $table) {
            $table->id();
            // Liên kết với đơn thuê
            $table->foreignId('rental_order_id')
                ->constrained('rental_orders')
                ->onDelete('cascade');
            // Thông tin chung
            $table->string('contract_number')->unique();   // Số hợp đồng
            $table->date('contract_date');                 // Ngày ký hợp đồng
            $table->string('location');                    // Địa điểm ký hợp đồng
            // Thông tin căn hộ
            $table->string('apartment_address');           // Địa chỉ căn hộ
            $table->longText('structure');                   // Cấu trúc căn hộ
            // Giá thuê và thanh toán
            $table->decimal('monthly_rent', 12, 2);        // Giá thuê hàng tháng
            $table->decimal('deposit', 12, 2);             // Tiền đặt cọc
            $table->unsignedInteger('deposit_months');     // Số tháng đặt cọc
            $table->unsignedInteger('payment_date');       // Ngày thanh toán hàng tháng
            // Thời gian thuê
            $table->unsignedInteger('duration');           // Số tháng thuê
            $table->date('start_date');                    // Ngày bắt đầu
            $table->date('end_date');                      // Ngày kết thúc
            // Dữ liệu các bên (JSON để dễ lưu nhiều trường)
            $table->longText('landlord_data');                 // Thông tin bên A (chủ nhà)
            $table->longText('tenant_data');                   // Thông tin bên B (người thuê)
            // Chữ ký (ảnh base64 hoặc path file)
            $table->longText('landlord_signature')->nullable();
            $table->longText('tenant_signature')->nullable();
            // File hợp đồng
            $table->string('pdf_path')->nullable();        // Đường dẫn file PDF hợp đồng
            $table->timestamps();
        });
        //bảng bảo trì 
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();

            // Liên kết đến căn hộ gặp sự cố
            $table->foreignId('apartment_id')
                ->constrained('apartments')
                ->onDelete('cascade');

            // Người gửi yêu cầu (khách thuê)
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            // Mô tả vấn đề bảo trì
            $table->text('description');

            // Hình ảnh minh họa (nếu có)
            $table->string('attachment')->nullable();

            // Trạng thái xử lý bảo trì
            $table->enum('status', [
                'pending',       // Đang chờ xử lý
                'in_progress',   // Đang bảo trì
                'completed',     // Đã hoàn tất
                'rejected'       // Bị từ chối
            ])->default('pending');

            // Ghi chú nội bộ
            $table->text('note')->nullable();

            $table->timestamps();
        });

        //bảng thông báo
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // Người nhận thông báo (user_id có thể là chủ nhà hoặc khách thuê)
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Tiêu đề thông báo (ví dụ: "Yêu cầu bảo trì mới", "Hợp đồng sắp hết hạn")
            $table->string('title');

            // Nội dung thông báo chi tiết
            $table->text('message')->nullable();

            // Loại thông báo: maintenance, payment, contract, system, v.v.
            $table->string('type')->default('system');

            // Trạng thái đọc thông báo
            $table->enum('status', [
                'unread',   // Chưa đọc
                'read'      // Đã đọc
            ])->default('unread');

            $table->string('url')->nullable();

            // Dấu thời gian để sắp xếp theo thời gian gửi
            $table->timestamps();
        });
    }

    public function down()
    {
        // Xóa bảng theo thứ tự ngược lại để tránh lỗi khóa ngoại
        Schema::dropIfExists('payments');
        Schema::dropIfExists('rental_orders');
        Schema::dropIfExists('apartment_images');
        Schema::dropIfExists('apartments');
        Schema::dropIfExists('users');
    }
}
