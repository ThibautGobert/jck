<?php

namespace App\Console\Commands;

use App\Models\Country;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class UpdateCountriesCoordinates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'countries:update-coordinates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update countries lat and lng coordinates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $countries = Country::orderBy('nom_en', 'desc')->whereNull('lat')->orWhereNull('lng')->get();

        foreach ($countries as $country) {

            $response = Http::get("https://nominatim.openstreetmap.org/search", [
                'country' => $country->alpha2,
                'format' => 'json',
                'limit' => 1,
            ]);

            if ($response->successful() && count($response->json()) > 0) {
                $data = $response->json()[0];
                $country->lat = $data['lat'];
                $country->lng = $data['lon'];
                $country->save();

                $this->info("Updated {$country->nom_en} coordinates.");
            } else {
                $this->error("Failed to update {$country->nom_en} coordinates.");
            }
            sleep(5);
        }
    }
}
