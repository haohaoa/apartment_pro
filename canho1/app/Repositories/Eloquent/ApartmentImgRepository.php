<?php
namespace App\Repositories\Eloquent;

use App\Models\Apartment;
use App\Models\ApartmentImage;
use App\Repositories\Interfaces\ApartmentImgRepositoryInterface;

class ApartmentImgRepository implements ApartmentImgRepositoryInterface
{
    public function all()
    {
        return ApartmentImage::all();
    }

    public function find($id)
    {
        return ApartmentImage::with('apartment')->findOrFail($id);
    }

    public function create(array $data)
    {
        return ApartmentImage::create($data);
    }

    public function update($id, array $data)
    {
        $apartmentImage = ApartmentImage::findOrFail($id);
        $apartmentImage->update($data);
        return $apartmentImage;
    }

    public function delete($id)
    {
        return ApartmentImage::destroy($id);
    }

    public function search(array $filters, $perPage = 10)
    {
        // TODO: viết filter tìm kiếm
    }

    /**
     * Tạo nhiều ảnh cho 1 căn hộ
     */
    public function createMultiple(int $apartmentId, array $images)
    {
        $savedImages = [];

        foreach ($images as $image) {
            // Tạo tên file duy nhất
            $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            // Di chuyển ảnh vào thư mục public/img trực tiếp
            $image->move(public_path('img'), $fileName);

            // Lưu DB
            $savedImages[] = ApartmentImage::create([
                'apartment_id' => $apartmentId,
                'image_url' => '/img/'.$fileName,
            ]);
        }

        return $savedImages;
    }

   
}
