import {Link, Head, usePage} from '@inertiajs/react';
import {Cartesian3, ClockRange, Color, EasingFunction, Ion, Math as CesiumMath} from 'cesium'
import {
    Viewer,
    Entity,
    LabelGraphics,
    ScreenSpaceCameraController,
    SkyBox,
    Scene,
    Moon,
    BillboardGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent, Sun, Camera
} from 'resium'
import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg0NzFkNy1mODUwLTQ5NTAtOGNkYi1jM2M2YWRjMjkxYmUiLCJpZCI6MTk3NzQ1LCJpYXQiOjE3MDg4NzQxNDR9.RndVYXUabck3KbIWonoZUTLA7BSkF48dfAXoYgSm_tw"
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const viewerRef = useRef(null);
    const [apostasies, setApostasies] = useState(usePage().props.apostasies)
    const [initialCameraHeight, setInitialCameraHeight] = useState(null)
    const [location, setLocation] = useState({latitude: null, longitude: null});
    const [error, setError] = useState(null);
    const minCameraHeight = 3000000
    const maxCameraHeight = 10000000
    useEffect(() => {
        window.Echo.channel('apostatsies')
            .listen('ApostasyCreatedEvent',  (e) => {
                setApostasies([...apostasies, e.apostasy])
                flyTo(e.apostasy.country.lat, e.apostasy.country.lng, minCameraHeight)
                /*
                setTimeout(()=> {
                    flyTo(e.apostasy.country.lat, e.apostasy.country.lng, minCameraHeight)
                }, 2500)

                 */
            });

        if (viewerRef.current && viewerRef.current.cesiumElement) {
            const viewer = viewerRef.current.cesiumElement;
            const initialCameraPosition = viewer.camera.positionCartographic;
            const initialCameraHeight = initialCameraPosition.height; // Hauteur initiale de la caméra par rapport à la surface de la Terre
            setInitialCameraHeight(initialCameraHeight)
            getLocation()
           // viewer.scene.skyBox.show = false;
            //viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#FFFFFF')
            //viewer.scene.moon.show = false;
            /*
            let lastTime = Date.now();
            const rotateRate = 0.03; // Vitesse de rotation, ajustez selon vos besoins

            viewer.clock.onTick.addEventListener(clock => {
                let currentTime = Date.now();
                let delta = (currentTime - lastTime) / 1000;
                lastTime = currentTime;

                const spinRate = rotateRate * delta;
                const camera = viewer.camera;

                // Déterminez l'orientation de la caméra pour garder les pôles alignés verticalement
                camera.rotate(Cesium.Cartesian3.UNIT_Z, spinRate);
            });

             */
            /*
            const cameraController = viewer.scene.screenSpaceCameraController;
            cameraController.enableZoom

             */
            // Définit la distance minimale de zoom (en mètres)
            /*
            cameraController.minimumZoomDistance = 100000000;
            cameraController.maximumZoomDistance = 100000000;

             */
        }

    }, [viewerRef.current]);
    useEffect(() => {
        if(location.latitude && location.longitude) {
            flyTo(location.latitude, location.longitude, minCameraHeight)
            /*
            setTimeout(()=> {
                flyTo(location.latitude, location.longitude, minCameraHeight)
            }, 2500)

             */

        }
    }, [location.latitude, location.longitude]);

    const handleEntityClick = (e)=> {
        console.log('click')
        console.log(e)
    }
    const handleButtonClick = ()=> {
        const viewer = viewerRef.current.cesiumElement;
        const destination = Cartesian3.fromDegrees(4.3517, 50.8503, 10000000); // Longitude, Latitude, Hauteur

        // Exécute flyTo vers la destination
        viewer.camera.flyTo({
            destination,
            duration: 3, // Durée du vol en secondes
        });
    }
    const flyTo = (lat, lng, height = 10000000)=> {
        const viewer = viewerRef.current.cesiumElement;
        const destination = Cartesian3.fromDegrees(lng, lat, height); // Longitude, Latitude, Hauteur

        // Exécute flyTo vers la destination
        viewer.camera.flyTo({
            destination,
            duration: 4, // Durée du vol en secondes
            maximumHeight: maxCameraHeight,
            //pitchAdjustHeight: 2,
            easingFunction: EasingFunction.CUBIC_IN_OUT
        });
    }
    const apostasiesEntities = ()=> {
        return apostasies.map(a=> {
            return <div key={a.id}>
                <Entity
                    position={Cartesian3.fromDegrees(parseFloat(a.country.lng), parseFloat(a.country.lat))} // Long, Lat
                    //point={{ pixelSize: 3, color: Color.RED }}
                    name={a.country.nom_fr}
                    onClick={(e)=> handleEntityClick(e)}
                >
                    <BillboardGraphics image="/images/jack-hat-20.png"></BillboardGraphics>

                </Entity>
            </div>
        })
    }
    const screenSpaceEventHandle = (movement)=> {
        const viewer = viewerRef.current.cesiumElement;
        const pickedObject = viewer.scene.pick(movement.endPosition);

        if (!pickedObject) {
            // Aucune entité sous la souris
            const globe = viewer.scene.globe;
            if (globe && globe.ellipsoid) {
                // Vérifiez si la souris est à l'intérieur des limites du globe
                const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, globe.ellipsoid);
                if (cartesian) {
                    // La souris est au-dessus de la planète
                    viewer.canvas.style.cursor = 'grab';
                    return;
                }
            }
        }

        // La souris est au-dessus d'une entité ou en dehors du globe
        const entity = viewer.entities.values.find((entity) => {
            return Cesium.defined(pickedObject) && pickedObject.id === entity;
        });

        if (entity) {
            viewer.canvas.style.cursor = 'pointer';
        } else {
            viewer.canvas.style.cursor = '';
        }
    }
    const getLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            console.log('La géolocalisation n\'est pas prise en charge par ce navigateur.');
        }
    };


    return (
        <div className="relative">
            <Head title="Welcome" />
            <div className="absolute bg-white" style={{top: '0', bottom:'0', 'left':0,'right':'0'}}>

            </div>
            <div id="credit-container" style={{display: 'none'}}></div>
                <Viewer style={{positon: 'absolute', width: '100%', height: '100vh'}}
                        infoBox={true}
                        ref={viewerRef}
                        baseLayerPicker={false}
                        geocoder={false}
                        homeButton={false}
                        sceneModePicker={false}
                        selectionIndicator={false}
                        timeline={false}
                        navigationHelpButton={false}
                        fullscreenButton={false}
                        animation={false}
                        creditContainer={'credit-container'}
                >
                    <div className="bg-white" style={{'position': 'absolute', 'top': '0'}}>
                        jjergjergmjgomjre
                    </div>
                    <ScreenSpaceCameraController enableZoom={true} minimumZoomDistance={minCameraHeight} ></ScreenSpaceCameraController>
                    <SkyBox show={false}></SkyBox>
                    <Scene backgroundColor={Color.WHITE}>
                        <ScreenSpaceEventHandler>
                            <ScreenSpaceEvent type={Cesium.ScreenSpaceEventType.MOUSE_MOVE} action={screenSpaceEventHandle}></ScreenSpaceEvent>
                        </ScreenSpaceEventHandler>
                    </Scene>
                    <Moon show={false} ></Moon>
                    <Sun show={false}></Sun>
                    {/*<Camera
                        position={Cartesian3.fromDegrees(4.3517, 50.8503, 5000000)}
                        orientation={{
                            heading: Cesium.Math.toRadians(0),
                            pitch: Cesium.Math.toRadians(-90),
                            roll: Cesium.Math.toRadians(0)
                        }}
                    ></Camera>*/}

                    {/*<Entity
                        position={Cartesian3.fromDegrees(4.3517, 50.8503)} // Long, Lat
                        //point={{ pixelSize: 3, color: Color.RED }}
                        name={'Bruxelles'}
                        description={"<h1 style='cursor: pointer'>Bruxelles, Belgique</h1><p>La capitale de la Belgique.</p>"}
                        onClick={(e) => handleEntityClick(e)}
                    >

                    </Entity>
                        <Entity
                        position={Cartesian3.fromDegrees(4.3517, 50.8503)} // Long, Lat
                    //point={{ pixelSize: 3, color: Color.RED }}
                    name={'Bruxelles'}
                    description={"<h1 style='cursor: pointer'>Bruxelles, Belgique</h1><p>La capitale de la Belgique.</p>"}
                    onClick={(e) => handleEntityClick(e)}
                >
                    <BillboardGraphics image="/images/jack-hat-30.png"></BillboardGraphics>

                </Entity>*/}
                    {apostasiesEntities()}

                    {/*<Entity
                    name="Tokyo"
                    position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
                    point={{pixelSize: 10, color: Color.WHITE}}
                    description="hoge"
                />*/}
                </Viewer>
        </div>
    );
}
