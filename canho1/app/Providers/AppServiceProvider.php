<?php

namespace App\Providers;

use App\Repositories\Eloquent\ApartmentImgRepository;
use App\Repositories\Eloquent\BuildingRepository;
use App\Repositories\Eloquent\ContractRepository;
use App\Repositories\Eloquent\NotificationRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Interfaces\ApartmentImgRepositoryInterface;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use App\Repositories\Interfaces\ContractRepositoryInterface;
use App\Repositories\Interfaces\NotificationRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\ViewingSchedulesRepositoryInterface;
use App\Repositories\Eloquent\ApartmentRepository;
use App\Repositories\Eloquent\ViewingSchedulesRepository;
use App\Repositories\Eloquent\OrderRepository;
use App\Repositories\Interfaces\OrderRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Đăng ký binding giữa Interface và Repository cụ thể
        $this->app->bind(ApartmentRepositoryInterface::class, ApartmentRepository::class);
        $this->app->bind(ViewingSchedulesRepositoryInterface::class, ViewingSchedulesRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(ContractRepositoryInterface::class, ContractRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BuildingRepositoryInterface::class , BuildingRepository::class);
        $this->app->bind(ApartmentImgRepositoryInterface::class, ApartmentImgRepository::class);
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
