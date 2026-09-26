<?php

namespace Database\Seeders;

use App\Models\Bus;
use App\Models\BusRoute;
use App\Models\BusStop;
use App\Models\Player;
use App\Models\PlayerBusAssignment;
use Illuminate\Database\Seeder;

class TransportationSeeder extends Seeder
{
    public function run(): void
    {
        $academyId = 1;

        $busData = [
            [
                'bus_number' => 'FAW-01',
                'name' => 'FAW North',
                'capacity' => 30,
                'driver_name' => 'Sameh Ahmad',
                'driver_phone' => '0792000001',
                'departure_time' => '15:30',
                'is_active' => true,
            ],
            [
                'bus_number' => 'FAW-02',
                'name' => 'FAW South',
                'capacity' => 30,
                'driver_name' => 'Khaled Ali',
                'driver_phone' => '0792000002',
                'departure_time' => '15:45',
                'is_active' => true,
            ],
            [
                'bus_number' => 'FAW-03',
                'name' => 'FAW University',
                'capacity' => 25,
                'driver_name' => 'Omar Hassan',
                'driver_phone' => '0792000003',
                'departure_time' => '16:00',
                'is_active' => true,
            ],
            [
                'bus_number' => 'FAW-04',
                'name' => 'FAW City',
                'capacity' => 30,
                'driver_name' => 'Mohammad Saleh',
                'driver_phone' => '0792000004',
                'departure_time' => '16:15',
                'is_active' => true,
            ],
            [
                'bus_number' => 'FAW-05',
                'name' => 'FAW West',
                'capacity' => 25,
                'driver_name' => 'Ahmad Mahmoud',
                'driver_phone' => '0792000005',
                'departure_time' => '16:30',
                'is_active' => true,
            ],
        ];

        foreach ($busData as $data) {
            Bus::updateOrCreate(
                [
                    'academy_id' => $academyId,
                    'bus_number' => $data['bus_number'],
                ],
                [
                    ...$data,
                    'academy_id' => $academyId,
                ]
            );
        }

        $buses = Bus::where('academy_id', $academyId)
            ->orderBy('id')
            ->get();

        $routeNames = [
            'North Route',
            'South Route',
            'University Route',
            'City Route',
            'West Route',
            'East Route',
        ];

        foreach ($routeNames as $index => $routeName) {
            $bus = $buses[$index % $buses->count()];

            BusRoute::updateOrCreate(
                [
                    'academy_id' => $academyId,
                    'name' => $routeName,
                ],
                [
                    'academy_id' => $academyId,
                    'bus_id' => $bus->id,
                    'name' => $routeName,
                    'is_active' => true,
                ]
            );
        }

        $routes = BusRoute::where('academy_id', $academyId)
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        $stopNames = [
            'University Street',
            'Al-Hassan Industrial Estate',
            'Yarmouk University',
            'Downtown Irbid',
            'Al-Hashmi Area',
            'Al-Naseem Area',
            'Al-Rawda Area',
            'Al-Husn Area',
            'Al-Barha Area',
            'Al-Hashimiyah Area',
            'Al-Mafraq Road',
            'Western District',
            'Eastern District',
            'Northern District',
            'Southern District',
            'Al-Zahra Area',
            'Al-Andalus Area',
            'Al-Rabieh Area',
            'Al-Nahda Area',
            'Al-Jabal Area',
        ];

        foreach ($routes as $routeIndex => $route) {
            for ($i = 1; $i <= 3; $i++) {
                $number = ($routeIndex * 3) + $i;

                if ($number > count($stopNames)) {
                    break;
                }

                BusStop::updateOrCreate(
                    [
                        'bus_route_id' => $route->id,
                        'stop_order' => $i,
                    ],
                    [
                        'bus_route_id' => $route->id,
                        'name' => $stopNames[$number - 1],
                        'address' => $stopNames[$number - 1] . ', Irbid',
                        'pickup_time' => sprintf(
                            '%02d:%02d',
                            15 + (($routeIndex + $i) % 3),
                            10 + ($i * 10)
                        ),
                        'stop_order' => $i,
                        'is_active' => true,
                    ]
                );
            }
        }

        $players = Player::where('academy_id', $academyId)
            ->orderBy('id')
            ->get();

        $stops = BusStop::whereHas('route', function ($query) use ($academyId) {
            $query->where('academy_id', $academyId);
        })
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        if ($routes->isEmpty() || $stops->isEmpty()) {
            return;
        }

        foreach ($players as $index => $player) {
            if (!$player->needs_transportation) {
                continue;
            }

            $route = $routes[$index % $routes->count()];

            $routeStops = $stops
                ->where('bus_route_id', $route->id)
                ->values();

            if ($routeStops->isEmpty()) {
                continue;
            }

            $stop = $routeStops[$index % $routeStops->count()];

            $player->update([
                'transportation_route_id' => $route->id,
            ]);

            PlayerBusAssignment::updateOrCreate(
                [
                    'player_id' => $player->id,
                ],
                [
                    'player_id' => $player->id,
                    'bus_route_id' => $route->id,
                    'bus_stop_id' => $stop->id,
                    'is_active' => true,
                ]
            );
        }
    }
}