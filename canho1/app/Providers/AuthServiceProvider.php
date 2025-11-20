<?php

namespace App\Providers;

use App\Models\Apartment;
use App\Models\User;
use App\Policies\ApartmentSchedulePolicy;
use App\Policies\UserSchedulePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\ViewingSchedule;
use App\Policies\ViewingSchedulePolicy;
use App\Policies\RentalOrderSchedulePolicy;
use App\Policies\BuildingSchedulePolicy;
use App\Models\RentalOrder;
use App\Models\Building;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Mapping model → policy
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        ViewingSchedule::class => ViewingSchedulePolicy::class,
        RentalOrder::class => RentalOrderSchedulePolicy::class,
        Building::class => BuildingSchedulePolicy::class,
        Apartment::class => ApartmentSchedulePolicy::class,
        User::class => UserSchedulePolicy::class
    ];

    /**
     * Bootstrap any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
