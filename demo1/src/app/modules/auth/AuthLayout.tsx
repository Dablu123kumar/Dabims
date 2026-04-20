/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    const prev = root?.style.height
    if (root) {
      root.style.height = 'auto'
      root.style.minHeight = '100%'
    }
    return () => {
      if (root) {
        root.style.height = prev || 'auto'
        root.style.minHeight = ''
      }
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-lg-row flex-column-fluid'
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7ff 0%, #eef2ff 50%, #f0f4ff 100%)',
      }}
    >
      {/* begin::Body (form side) */}
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-4 p-lg-8 order-2 order-lg-1'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* Mobile logo */}
          <Link to='/' className='d-lg-none mb-6'>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/logos/ims-logo.svg')}
              style={{height: 64, objectFit: 'contain'}}
            />
          </Link>

          {/* begin::Wrapper (glass card) */}
          <div
            className='w-100'
            style={{
              maxWidth: 560,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: 20,
              boxShadow:
                '0 20px 60px rgba(32, 45, 110, 0.12), 0 2px 6px rgba(32, 45, 110, 0.05)',
              padding: '2rem 1.75rem',
              margin: '1.25rem 0',
            }}
          >
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}

        {/* begin::Footer */}
        <div className='d-flex flex-center flex-wrap px-5 pt-6'>
          <div className='text-gray-500 fw-semibold fs-7'>
            &copy; {new Date().getFullYear()} Institute Management System. All rights reserved.
          </div>
        </div>
        {/* end::Footer */}
      </div>
      {/* end::Body */}

      {/* begin::Aside (branding side) */}
      <div
        className='d-none d-lg-flex flex-lg-row-fluid w-lg-50 order-1 order-lg-2 position-relative overflow-hidden'
        style={{
          background:
            'linear-gradient(135deg, #4b3df5 0%, #6a4cff 40%, #9b6dff 75%, #c084fc 100%)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          alignSelf: 'flex-start',
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-140px',
            left: '-100px',
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)',
            filter: 'blur(24px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${toAbsoluteUrl('/media/misc/pattern-4.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
            mixBlendMode: 'overlay',
          }}
        />

        {/* begin::Content */}
        <div
          className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100 position-relative'
          style={{zIndex: 2}}
        >
          {/* Logo */}
          <Link to='/' className='mb-10'>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/logos/ims-logo.svg')}
              style={{
                width: 112,
                height: 112,
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.25))',
              }}
            />
          </Link>

          {/* Title */}
          <h1
            className='text-white text-center mb-4'
            style={{fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.5px'}}
          >
            Institute Management System
          </h1>

          {/* Subtitle */}
          <p
            className='text-center mb-10'
            style={{
              color: 'rgba(255,255,255,0.88)',
              fontSize: '1.05rem',
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            A premium platform built for modern education — manage students, courses, fees,
            and staff seamlessly in one place.
          </p>

          {/* Feature highlights */}
          <div className='d-flex flex-column gap-3 w-100' style={{maxWidth: 420}}>
            {[
              {icon: '✓', title: 'All-in-one institute management'},
              {icon: '✓', title: 'Secure multi-tenant architecture'},
              {icon: '✓', title: 'Insightful reports & analytics'},
            ].map((f) => (
              <div
                key={f.title}
                className='d-flex align-items-center gap-3 px-4 py-3'
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 12,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span
                  className='d-flex align-items-center justify-content-center'
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#6a4cff',
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  {f.icon}
                </span>
                <span className='text-white fw-semibold'>{f.title}</span>
              </div>
            ))}
          </div>
        </div>
        {/* end::Content */}
      </div>
      {/* end::Aside */}
    </div>
  )
}

export {AuthLayout}
