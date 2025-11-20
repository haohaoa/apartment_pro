<?php
namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function all()
    {
        return User::all();
    }

    public function find($id)
    {
        return User::findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update($id, array $data)
    {
        $RentalContract = User::findOrFail($id);
        $RentalContract->update($data);
        return $RentalContract;
    }

    public function delete($id)
    {
        return User::destroy($id);
    }

    public function search(array $filters, $perPage = 10)
    {
        //
    }
    public function resendOtp($email , $OTP){
        $user = User::where("email", $email)->first();
        if($user){
            $user->verification_code = $OTP;
            $user->save();
            return $user;
        }else{
            return false;
        }
    }

}
