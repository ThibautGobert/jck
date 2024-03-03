<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ApostasyResource\Pages;
use App\Filament\Resources\ApostasyResource\RelationManagers;
use App\Models\Apostasy;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ApostasyResource extends Resource
{
    protected static ?string $model = Apostasy::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                DateTimePicker::make('date')->label('Date')
                    ->native(false)
                    ->time(false)
                    ->required(),
                Forms\Components\Select::make('user_id')
                    ->relationship(name: 'user', titleAttribute: 'name')
                    ->native(false)
                    ->searchable(),
                Forms\Components\Select::make('country_id')
                    ->relationship(name: 'country', titleAttribute: 'nom_fr')
                    ->native(false)
                    ->searchable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('Utilisateur')->sortable()->searchable(),
                TextColumn::make('country.nom_fr')->label('Pays')->sortable()->searchable(),
                TextColumn::make('date')->label('Date')->sortable()->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //RelationManagers\UserRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListApostasies::route('/'),
            'create' => Pages\CreateApostasy::route('/create'),
            'edit' => Pages\EditApostasy::route('/{record}/edit'),
        ];
    }
}
