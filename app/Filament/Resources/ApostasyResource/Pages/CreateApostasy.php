<?php

namespace App\Filament\Resources\ApostasyResource\Pages;

use App\Events\ApostasyCreatedEvent;
use App\Filament\Resources\ApostasyResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Event;

class CreateApostasy extends CreateRecord
{
    protected static string $resource = ApostasyResource::class;

    protected function afterCreate(): void
    {
        Event::dispatch(new ApostasyCreatedEvent($this->record?->load('country')));
    }
}
