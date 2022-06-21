import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface CameraPosition {
    x?: number
    y?: number
    z?: number
}

interface Rotation extends CameraPosition {}

interface BoxGeometryOptions {
    width?: number
    height?: number
    depth?: number
    widthSegments?: number
    heightSegments?: number
    depthSegments?: number
}

export class BoxScene {
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private object: THREE.Object3D
    private controls: any
    private inputColor: any
    private objectColor: any

    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.object = new THREE.Mesh()
        this.objectColor = 0x404040
        this.inputColor = document.querySelector('[data-color]')
        this.changeColorEvent()
    }

    public start() {
        this.setCameraPosition({ z: 2 })
        this.setRenderer()
        this.setLighting(0xffffff, 2)
        this.setOrbitControls()
        this.createObject(
        {
            width: 3,
            height: 1,
            depth: 1,
        },
        {
            color: this.objectColor,
            // wireframe: true,
        })
        
        // this.setRotation({ 
        //     x: 0.01, 
        //     y: 0.01 
        // })

        this.windowResizeHandler()
        this.animate()
    }

    private changeColorEvent(): void {
        if (!this.inputColor) return
        console.log(this.inputColor)
        this.inputColor.onchange = (e: any) => {
            const colorCode = this.inputColor.value
            this.objectColor = new THREE.Color(colorCode)
            console.log(colorCode)
            this.start()
        }
    }
    
    private setRenderer(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
    }

    public setCameraPosition(position: CameraPosition): void {
        position.x ? this.camera.position.x = position.x : null
        position.y ? this.camera.position.y = position.y : null
        position.z ? this.camera.position.z = position.z : null
    }

    public setLighting(lightColor: any, size: number): void {
        const light = new THREE.AmbientLight(lightColor, size)
        light.position.set(15, 10, 0)
        light.castShadow = true
        this.scene.add(light)

        // const sphereSize = 1
        // const pointLightHelper = new THREE.PointLightHelper(light, sphereSize)
        // this.scene.add(pointLightHelper)
    }

    public setOrbitControls(): void {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    public createObject(geometryOptions: BoxGeometryOptions, materialOptions?: THREE.MeshPhongMaterialParameters): void {
        const geoOptions = Object.values(geometryOptions)
        const geometry = new THREE.BoxGeometry(...geoOptions)
        const material = new THREE.MeshPhongMaterial(materialOptions)

        // const texture = new THREE.TextureLoader().load("../../assets/wood-texture.jpg")
        // material.map = texture

        this.object = new THREE.Mesh(geometry, material)
        this.scene.add(this.object)
    }

    public setRotation(rotation: Rotation): void {
        rotation.x ? this.object.rotation.x += rotation.x : null
        rotation.y ? this.object.rotation.y += rotation.y : null
        rotation.z ? this.object.rotation.z += rotation.z : null
    }

    public animate(): void {
        requestAnimationFrame(this.animate.bind(this))
    
        this.controls.update()
        this.render()
    }
    
    private render(): void {
        this.renderer.render(this.scene, this.camera)
    }

    private windowResizeHandler(): void {
        window.addEventListener('resize', this.onWindowResize, false)
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }
    
}   

const box = new BoxScene()
box.start()