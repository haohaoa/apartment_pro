<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\ApartmentImgRepositoryInterface;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use App\Repositories\Interfaces\ContractRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

class ContractController extends Controller
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
    public function viewAllById()
    {
        try {
            // Lấy ID user hiện tại
            $userId = auth()->id();
            // Lấy tất cả hợp đồng của user
            $contracts = $this->orderRepository->getOwnerID($userId);
            if (!$contracts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy hợp đồng'
                ], 404);
            }
            // Trả về JSON chuẩn
            return response()->json([
                'success' => true,
                'message' => 'Danh sách hợp đồng của bạn',
                'data' => $contracts
            ], 200);

        } catch (\Throwable $th) {
            // Ghi log nếu cần
            \Log::error('Lỗi khi lấy hợp đồng: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Lấy danh sách hợp đồng thất bại, vui lòng thử lại sau ' . $th->getMessage()
            ], 500);
        }
    }
    public function viewAllByIdAdmin()
    {
        try {
            
            // Lấy tất cả hợp đồng của user
            $contracts = $this->orderRepository->all();
            if (!$contracts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy hợp đồng'
                ], 404);
            }
            // Trả về JSON chuẩn
            return response()->json([
                'success' => true,
                'message' => 'Danh sách hợp đồng của bạn',
                'data' => $contracts
            ], 200);

        } catch (\Throwable $th) {
            // Ghi log nếu cần
            \Log::error('Lỗi khi lấy hợp đồng: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Lấy danh sách hợp đồng thất bại, vui lòng thử lại sau ' . $th->getMessage()
            ], 500);
        }
    }
    public function getByIdContract($id)
    {
        try {

            // Lấy tất cả hợp đồng
            $contracts = $this->contractRepository->getByIdOrder($id);
            // $order = $contracts->order;
            // dd($order);
            // $this->authorize('view', $order);
            if (!$contracts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy hợp đồng'
                ], 404);
            }
            // Trả về JSON chuản
            return response()->json([
                'success' => true,
                'message' => 'Danh sách hợp đồng',
                'data' => $contracts
            ], 200);

        } catch (\Throwable $th) {
            // Ghi log nếu cần
            \Log::error('Lỗi khi lấy hợp đồng: ' . $th->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Lấy danh sách hợp đồng thất bại, vuiご thử lagi sau ' . $th->getMessage()
            ], 500);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xóa tòa nhà này',
            ], 403);
        }
    }
}
