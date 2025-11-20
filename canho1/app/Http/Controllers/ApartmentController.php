<?php

namespace App\Http\Controllers;

use App\Models\Apartment;
use App\Models\Building;
use App\Repositories\Interfaces\ApartmentImgRepositoryInterface;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use App\Repositories\Interfaces\ContractRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

class ApartmentController extends Controller
{
    protected $contractRepository;
    protected $orderRepository;
    protected $userRepository;
    protected $apartmentRepository;
    protected $buidungRepository;
    protected $apartmentImgRepository;

    public function __construct(
        ContractRepositoryInterface $contractRepository,
        OrderRepositoryInterface $OrderRepository,
        UserRepositoryInterface $userRepository,
        BuildingRepositoryInterface $buidungRepository,
        ApartmentRepositoryInterface $apartmentRepository,
        ApartmentImgRepositoryInterface $apartmentImgRepository,
    ) {
        $this->contractRepository = $contractRepository;
        $this->orderRepository = $OrderRepository;
        $this->userRepository = $userRepository;
        $this->buidungRepository = $buidungRepository;
        $this->apartmentRepository = $apartmentRepository;
        $this->apartmentImgRepository = $apartmentImgRepository;
    }




    public function store(Request $request, $buildingId)
    {
        // Lấy thông tin tòa nhà
        $building = $this->buidungRepository->find($buildingId);

        // Phân quyền: chỉ owner hoặc admin mới được thêm căn hộ
        $this->authorize('cancel', $building);
        // dd($request->all());
        // Validate dữ liệu đầu vào
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string|max:500',
            'price' => 'required|numeric|min:0',
            'deposit' => 'required|numeric|min:0',
            'status' => 'required|in:available,rented',
            'images.*' => 'nullable|image|max:2048', // giới hạn ảnh 2MB
        ]);

        // Bổ sung dữ liệu hệ thống
        $validated['building_id'] = $building->id;
        // Tạo căn hộ
        $apartment = $this->apartmentRepository->create($validated);

        // Xử lý upload nhiều ảnh (nếu có)
        $images = $request->file('images', []);
        if (!empty($images)) {
            $this->apartmentImgRepository->createMultiple($apartment->id, $images);
        }

        // Load lại apartment kèm images để trả về
        $apartment->load('images');

        // Trả response JSON chuẩn REST
        return response()->json([
            'success' => true,
            'message' => 'Thêm căn hộ thành công',
            'data' => $apartment
        ], 201);
    }



    public function update(Request $request, $id)
    {
        try {
            // 🔍 Tìm căn hộ
            $apartment = $this->apartmentRepository->find($id);
            $building = $apartment->building;

            // 🔐 Kiểm tra quyền
            $this->authorize('update', $building);

            // ✅ Validate dữ liệu đầu vào
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'address' => 'required|string|max:500',
                'price' => 'required|numeric|min:0',
                'deposit' => 'required|numeric|min:0',
                'status' => 'required|in:available,rented',
                'images.*' => 'nullable|image|max:2048', // tối đa 2MB mỗi ảnh
                'remove_images' => 'nullable|array', // danh sách ID ảnh cần xóa
            ]);

            // 🔄 Cập nhật thông tin chính
            $validated['building_id'] = $building->id;
            $apartment = $this->apartmentRepository->update($id, $validated);

            // 🧹 Xóa ảnh cũ nếu có danh sách remove_images
            if (!empty($validated['remove_images'])) {
                foreach ($validated['remove_images'] as $imageId) {
                    $this->apartmentImgRepository->delete($imageId);
                }
            }

            // 🖼️ Upload ảnh mới (giới hạn 10 ảnh)
            $images = $request->file('images', []);
            if (!empty($images)) {
                if (count($images) > 10) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Chỉ được tải lên tối đa 10 ảnh mỗi lần.',
                    ], 422);
                }

                $this->apartmentImgRepository->createMultiple($apartment->id, $images);
            }

            // 🎉 Trả về kết quả thành công
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật căn hộ thành công',
                'data' => $apartment->load('images')
            ]);

        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền cập nhật tòa nhà này.',
            ], 403);
        } catch (\Exception $e) {
            // 🧯 Bắt lỗi bất ngờ khác
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function delete($id)
    {
        try {
            $apartment = $this->apartmentRepository->find($id);
            if (!$apartment) {
                return response()->json(['message' => 'Không tìm thấy căn hộ'], 404);
            }
            $building = $apartment->building;
            $this->authorize('delete', $building);
            $apartment->delete();
            return response()->json([
                'message' => 'Xóa căn hộ thành công!',
                'success' => true,
                'apartment_id' => $id,
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền cập nhật tòa nhà này.',
            ], 403);
        }
    }


    public function viewApartment($id)
    {
        try {
            // ✅ Lấy dữ liệu căn hộ
            $apartment = $this->apartmentRepository->viewApartment($id);
            $building = $apartment->building;
            $this->authorize('view', $building);

            if (!$apartment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Căn hộ không tồn tại',
                ], 404);
            }
            // ✅ Trả về dữ liệu thành công
            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin căn hộ thành công',
                'data' => $apartment,
            ], 200);
        } catch (\Throwable $th) {
            // ✅ Ghi log lỗi (nếu cần)
            \Log::error('Lỗi khi xem chi tiết căn hộ: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý',
            ], 500);

        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền cập nhật tòa nhà này.',
            ], 403);
        }
    }
    // lấy căn hộ đã thuê của user
    public function getUserRentedApartmentIds()
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập!',
                ], 401);
            }

            $apartments = $this->apartmentRepository->fetchUserApartments($user->id);
          
            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách căn hộ đã thuê thành công!',
                'data' => $apartments,
            ], 200);

        } catch (\Throwable $th) {
            \Log::error('Lỗi khi lấy danh sách căn hộ thuê: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu!',
            ], 500);
        }
    }

}
