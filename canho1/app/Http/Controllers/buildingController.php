<?php

namespace App\Http\Controllers;


use App\Repositories\Interfaces\BuildingRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;

class buildingController extends Controller
{
    protected $buildingRepository;
    public function __construct(BuildingRepositoryInterface $buildingRepository)
    {
        $this->buildingRepository = $buildingRepository;
    }
    public function getAllBuilding()
    {
        try {
            $userId = auth()->id();
            $buildings = $this->buildingRepository->getAllBuilding($userId);

            return response()->json([
                'success' => true,
                'message' => 'Danh sách tòa nhà lấy thành công',
                'data' => $buildings
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
    public function getAllBuildingAdmin()
    {
        try {


            $user = auth()->user();

            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền xem tất cả tòa nhà',
                    'data' => null
                ], 403);
            }
            $Building = $this->buildingRepository->all();
            return response()->json([
                'success' => true,
                'message' => 'Danh sách tòa nhà lấy thành công',
                'data' => $Building
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }


    public function updateBuilding(Request $request, $id)
    {
        try {
            $building = $this->buildingRepository->find($id);

            if (!$building) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tòa nhà không tồn tại',
                ], 404);
            }

            $this->authorize('update', $building);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'lat' => 'nullable|numeric|between:-90,90',
                'lng' => 'nullable|numeric|between:-180,180',
                'floors' => 'nullable|integer|min:1',
                'description' => 'nullable|string',
                'status' => 'required|in:active,inactive',
            ]);

            $updated = $this->buildingRepository->update($id, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật tòa nhà thành công',
                'data' => $updated,
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền cập nhật tòa nhà này.',
            ], 403);
        }
    }

    public function createBuilding(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'lat' => 'nullable|numeric|between:-90,90',
                'lng' => 'nullable|numeric|between:-180,180',
                'floors' => 'nullable|integer|min:1',
                'description' => 'nullable|string',
                'status' => 'required|in:active,inactive',
            ]);

            // Gán owner_id là user hiện tại
            $validated['owner_id'] = auth()->id();

            $building = $this->buildingRepository->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Thêm tòa nhà thành công',
                'data' => $building,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteBuilding($id)
    {
        try {
            $building = $this->buildingRepository->find($id);

            if (!$building) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tòa nhà không tồn tại',
                ], 404);
            }

            // Kiểm tra quyền
            $this->authorize('delete', $building);

            $this->buildingRepository->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Xóa tòa nhà thành công',
            ], 200);

        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xóa tòa nhà này',
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi xóa tòa nhà',
                'error' => $e->getMessage(), // chỉ nên bật khi debug
            ], 500);
        }
    }

    // tim kiếm căn hộ theo id tòa
    public function getBuildingById($id)
    {
        try {
            $building = $this->buildingRepository->find($id);

            if (!$building) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tòa nhà không tồn tại',
                ], 404);
            }

            $this->authorize('view', $building);

            return response()->json([
                'success' => true,
                'message' => 'Lấy tòa nhà thành công',
                'data' => $building,
            ], 200);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'data' => $building,
                'message' => 'Bạn không có quyền xem tòa nhà này',
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }


}
