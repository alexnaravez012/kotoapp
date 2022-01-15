ionic build --prod && (
	npx cap sync && del platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk & (
		cd platforms/android & (
			gradlew assembleRelease && cd .. && cd .. && (
				jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore firma.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk firma -keypass lel123 -storepass lel123 && (
					del tienda724.apk && (
						zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk tienda724.apk && (
							adb install tienda724.apk
						) || (
						  pause
						)
						pause
					) || (
					  pause
					)
				) || (
				  pause
				)	
			) || (
			  pause
			)
		) || (
		  pause
		)
	) || (
		  pause
		)
	)
) || (
	  pause
	)
)